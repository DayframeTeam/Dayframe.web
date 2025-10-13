import { Task } from '../types/dbTypes';

export class ProductivityUtils {
  // ---------- HELPERS ----------
  // parse 'HH:mm' or 'HH:mm:ss' to seconds since midnight
  private static timeStrToSeconds(t: string): number | null {
    if (!t) return null;
    const parts = t.split(':').map((p) => Number(p));
    if (parts.length < 2) return null;
    const h = Number.isFinite(parts[0]) ? parts[0] : 0;
    const m = Number.isFinite(parts[1]) ? parts[1] : 0;
    const s = parts.length >= 3 && Number.isFinite(parts[2]) ? parts[2] : 0;
    if (
      Number.isNaN(h) ||
      Number.isNaN(m) ||
      Number.isNaN(s) ||
      h < 0 ||
      h > 23 ||
      m < 0 ||
      m > 59 ||
      s < 0 ||
      s > 59
    )
      return null;
    return h * 3600 + m * 60 + s;
  }

  // format minute index (0..1439) to 'HH:MM'
  private static minuteToHHMM(min: number): string {
    const h = Math.floor((min % 1440) / 60);
    const m = min % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  // compute weekday index 0..6 where 0 = Monday
  private static weekdayFromDateString(dateStr?: string): number | null {
    if (!dateStr) return null;

    // If the dateStr is just 'YYYY-MM-DD' (no time), create a local Date at midnight
    const dateOnlyMatch = /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
    let d: Date;
    if (dateOnlyMatch) {
      const [y, m, day] = dateStr.split('-').map((s) => Number(s));
      if ([y, m, day].some((v) => !Number.isFinite(v))) return null;
      d = new Date(y, m - 1, day, 0, 0, 0); // local midnight
    } else {
      d = new Date(dateStr);
    }

    if (isNaN(d.getTime())) return null;
    const jsDay = d.getDay(); // 0 Sunday .. 6 Saturday
    return jsDay === 0 ? 6 : jsDay - 1; // 0=Mon .. 6=Sun
  }

  // make array of length 1440 and fill with 0
  private static zeros1440(): number[] {
    return new Array(1440).fill(0);
  }

  // ---------- CORE: build per-minute distribution for a task ----------
  /**
   * For a task, returns array[1440] with seconds contributed to each minute.
   * If start/end unknown -> uses created_at as single-second contribution to that minute.
   */
  private static secondsDistributionForTask(task: Task): number[] {
    const arr = ProductivityUtils.zeros1440();

    // try to obtain seconds since midnight for start and end
    const startSecs = task.start_time ? ProductivityUtils.timeStrToSeconds(task.start_time) : null;
    const endSecs = task.end_time ? ProductivityUtils.timeStrToSeconds(task.end_time) : null;

    if (startSecs === null && endSecs === null) {
      // If we have only task_date in "YYYY-MM-DD" form - interpret as local midnight.
      let created: Date | null = null;
      if (task.task_date) {
        const dateOnlyMatch = /^\d{4}-\d{2}-\d{2}$/.test(task.task_date);
        if (dateOnlyMatch) {
          const [y, m, day] = task.task_date.split('-').map((s) => Number(s));
          if ([y, m, day].every((v) => Number.isFinite(v))) {
            created = new Date(y, m - 1, day, 0, 0, 0); // local midnight
          }
        } else {
          const tmp = new Date(task.task_date);
          if (!isNaN(tmp.getTime())) created = tmp;
        }
      } else if (task.created_at) {
        const tmp = new Date(task.created_at);
        if (!isNaN(tmp.getTime())) created = tmp;
      }

      if (created) {
        const h = created.getHours();
        const m = created.getMinutes();
        const s = created.getSeconds();
        const sec = h * 3600 + m * 60 + s;
        const minuteIdx = Math.floor(sec / 60) % 1440;
        arr[minuteIdx] += 1; // count one second into that minute
      }
      return arr;
    }

    // If only start provided, assume instant or 1-second task at start.
    if (startSecs !== null && endSecs === null) {
      const sec = startSecs;
      const minuteIdx = Math.floor(sec / 60) % 1440;
      arr[minuteIdx] += 1;
      return arr;
    }

    // If only end provided, treat as instant at end
    if (endSecs !== null && startSecs === null) {
      const sec = endSecs;
      const minuteIdx = Math.floor(sec / 60) % 1440;
      arr[minuteIdx] += 1;
      return arr;
    }

    // Both provided -> distribute by overlap with each minute
    // Handle potential crossing midnight: if end <= start, assume it goes next day.
    let s = startSecs as number;
    let e = endSecs as number;
    if (e <= s) {
      // treat as crossing midnight: add 24h to e
      e = e + 24 * 3600;
    }

    // For each minute overlapped by [s, e) compute seconds overlap
    // minute i covers seconds [i*60, (i+1)*60)
    const startMinute = Math.floor(s / 60);
    const endMinute = Math.floor((e - 1) / 60); // inclusive last minute index (in seconds space)

    for (let minuteIdx = startMinute; minuteIdx <= endMinute; minuteIdx++) {
      // minute's absolute start in seconds
      const minuteAbsStart = minuteIdx * 60;
      const minuteAbsEnd = minuteAbsStart + 60;
      // overlap with [s, e)
      const overlapStart = Math.max(s, minuteAbsStart);
      const overlapEnd = Math.min(e, minuteAbsEnd);
      const overlap = Math.max(0, overlapEnd - overlapStart); // seconds
      // map minuteIdx back to 0..1439 via modulo (for crossing midnight)
      const normalizedMinute = ((minuteIdx % 1440) + 1440) % 1440;
      arr[normalizedMinute] += overlap;
    }

    return arr;
  }

  // ---------- PUBLIC API ----------

  /**
   * Анализирует пиковое время продуктивности (общий по всем дням) с минутной точностью.
   * Возвращает интервал в одну минуту (например '06:00' - '06:01') где суммарно было наибольшее количество выполненной работы (в секундах).
   */
  static analyzePeakProductivityTime(tasks: Task[]): {
    peakStartTime: string; // 'HH:MM'
    peakEndTime: string; // 'HH:MM' (следующая минута)
    peakMinuteIndex: number; // 0..1439
    peakSeconds: number; // суммарно секунд активности в этом минутном бине
  } {
    // aggregate seconds per minute across all completed tasks
    const minutes = ProductivityUtils.zeros1440(); // seconds per minute

    for (const t of tasks) {
      if (!t.is_done) continue;
      const dist = ProductivityUtils.secondsDistributionForTask(t);
      for (let i = 0; i < 1440; i++) minutes[i] += dist[i];
    }

    // find max minute
    let peakIdx = 0;
    let peakVal = 0;
    for (let i = 0; i < 1440; i++) {
      if (minutes[i] > peakVal) {
        peakVal = minutes[i];
        peakIdx = i;
      }
    }

    // Если нет данных, возвращаем 00:00
    if (peakVal === 0) {
      return {
        peakStartTime: '00:00',
        peakEndTime: '00:01',
        peakMinuteIndex: 0,
        peakSeconds: 0,
      };
    }

    const start = ProductivityUtils.minuteToHHMM(peakIdx);
    const end = ProductivityUtils.minuteToHHMM((peakIdx + 1) % 1440);

    return {
      peakStartTime: start,
      peakEndTime: end,
      peakMinuteIndex: peakIdx,
      peakSeconds: peakVal,
    };
  }

  /**
   * Анализирует продуктивность по дням недели с минутной точностью.
   * Для каждого дня возвращает: количество задач, лучшую минуту (интервал 1 мин) и временной диапазон активности (earliest start - latest end).
   */
  static analyzeWeeklyProductivity(tasks: Task[]): Array<{
    day: string; // 'Пн','Вт',...
    tasksCount: number; // количество завершённых задач в этот день
    bestMinuteStart: string; // 'HH:MM'
    bestMinuteEnd: string; // 'HH:MM'
    bestMinuteIndex: number; // 0..1439
    bestMinuteSeconds: number; // seconds in best minute
    timeRange: { start: string; end: string }; // earliest start and latest end in HH:MM
  }> {
    const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

    // prepare per-weekday arrays
    const perDaySeconds: number[][] = [];
    const perDayCounts: number[] = [];

    for (let i = 0; i < 7; i++) {
      perDaySeconds.push(ProductivityUtils.zeros1440());
      perDayCounts.push(0);
    }

    for (const t of tasks) {
      if (!t.is_done) continue;

      // determine weekday: prefer task_date -> created_at -> null (unknown)
      const weekday = ProductivityUtils.weekdayFromDateString(
        t.task_date ?? t.created_at ?? undefined
      );
      if (weekday === null) continue;

      perDayCounts[weekday] += 1;

      // distribute seconds into perDaySeconds
      const dist = ProductivityUtils.secondsDistributionForTask(t);
      for (let i = 0; i < 1440; i++) perDaySeconds[weekday][i] += dist[i];
    }

    // build results
    const result = [];
    for (let d = 0; d < 7; d++) {
      const mins = perDaySeconds[d];

      // best minute for the day
      let bestIdx = 0;
      let bestVal = 0;
      for (let i = 0; i < 1440; i++) {
        if (mins[i] > bestVal) {
          bestVal = mins[i];
          bestIdx = i;
        }
      }

      // determine earliest and latest used minute based on distribution (not on start_time/end_time presence)
      let firstUsed = -1;
      let lastUsed = -1;
      for (let i = 0; i < 1440; i++) {
        if (mins[i] > 0) {
          if (firstUsed === -1) firstUsed = i;
          lastUsed = i;
        }
      }

      // fallback defaults when no data for the day
      const startRange = firstUsed === -1 ? '00:00' : ProductivityUtils.minuteToHHMM(firstUsed);
      // end is lastUsed + 1 minute (interval end). If no data, keep '00:00'
      const endRange =
        lastUsed === -1 ? '00:00' : ProductivityUtils.minuteToHHMM((lastUsed + 1) % 1440);

      result.push({
        day: weekdays[d],
        tasksCount: perDayCounts[d],
        bestMinuteStart: ProductivityUtils.minuteToHHMM(bestIdx),
        bestMinuteEnd: ProductivityUtils.minuteToHHMM((bestIdx + 1) % 1440),
        bestMinuteIndex: bestIdx,
        bestMinuteSeconds: bestVal,
        timeRange: { start: startRange, end: endRange },
      });
    }

    return result;
  }

  /**
   * Анализ по категориям (оставил как в твоём варианте) — возвращает суммарные минуты потраченные на каждую категорию.
   * Использует секунды распределения и переводит обратно в минуты.
   */
  static analyzeTimeByCategories(tasks: Task[]): Array<{
    category: string;
    minutes: number;
    color: string;
  }> {
    const completed = tasks.filter((t) => t.is_done);
    const categorySeconds: Record<string, number> = {};

    for (const t of completed) {
      const cat = t.category ?? 'Без категории';
      const dist = ProductivityUtils.secondsDistributionForTask(t);
      const seconds = dist.reduce((s, x) => s + x, 0);
      categorySeconds[cat] = (categorySeconds[cat] || 0) + seconds;
    }

    const colors = [
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#96CEB4',
      '#FFEAA7',
      '#DDA0DD',
      '#98D8C8',
      '#F7DC6F',
      '#BB8FCE',
      '#85C1E9',
    ];

    const arr = Object.entries(categorySeconds).map(([cat, secs], idx) => ({
      category: cat,
      minutes: Math.round(secs / 60),
      color: colors[idx % colors.length],
    }));

    arr.sort((a, b) => b.minutes - a.minutes);
    return arr;
  }

  // main aggregator
  static getProductivityStats(tasks: Task[]) {
    return {
      peakTime: this.analyzePeakProductivityTime(tasks),
      weeklyData: this.analyzeWeeklyProductivity(tasks),
      categoryData: this.analyzeTimeByCategories(tasks),
    };
  }
}
