import { Task } from '../../types/dbTypes';

export class TimeAnalysisUtils {
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

  // ---------- CORE: build per-minute distribution for a task ----------
  /**
   * For a task, returns array[1440] with seconds contributed to each minute.
   * If start/end unknown -> uses created_at as single-second contribution to that minute.
   */
  private static secondsDistributionForTask(task: Task): number[] {
    const arr = new Array(1440).fill(0);

    // try to obtain seconds since midnight for start and end
    const startSecs = task.start_time ? TimeAnalysisUtils.timeStrToSeconds(task.start_time) : null;
    const endSecs = task.end_time ? TimeAnalysisUtils.timeStrToSeconds(task.end_time) : null;

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
   * Анализ среднего времени на задачи по категориям.
   * Возвращает среднее время выполнения задач для каждой категории.
   */
  static analyzeAverageTimeByCategories(tasks: Task[]): Array<{
    category: string;
    averageMinutes: number;
    taskCount: number;
    totalMinutes: number;
    color: string;
  }> {
    const completed = tasks.filter((t) => t.is_done);
    const categoryData: Record<string, { totalSeconds: number; taskCount: number }> = {};

    for (const t of completed) {
      const cat = t.category ?? 'остальное';
      const dist = TimeAnalysisUtils.secondsDistributionForTask(t);
      const seconds = dist.reduce((s, x) => s + x, 0);

      if (!categoryData[cat]) {
        categoryData[cat] = { totalSeconds: 0, taskCount: 0 };
      }

      categoryData[cat].totalSeconds += seconds;
      categoryData[cat].taskCount += 1;
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

    const arr = Object.entries(categoryData).map(([cat, data], idx) => ({
      category: cat,
      averageMinutes: Math.round(data.totalSeconds / 60 / data.taskCount),
      taskCount: data.taskCount,
      totalMinutes: Math.round(data.totalSeconds / 60),
      color: colors[idx % colors.length],
    }));

    arr.sort((a, b) => b.averageMinutes - a.averageMinutes);
    return arr;
  }

  // main aggregator
  static getTimeAnalysisStats(tasks: Task[]) {
    return {
      averageTimeByCategory: this.analyzeAverageTimeByCategories(tasks),
    };
  }
}
