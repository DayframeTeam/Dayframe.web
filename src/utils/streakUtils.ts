import { Task } from '../types/dbTypes';

/**
 * Утилиты для подсчета стриков выполнения задач
 */
export class StreakUtils {
  /**
   * Подсчитывает текущий стрик выполнения задач
   * @param tasks - массив всех задач
   * @param currentDate - текущая дата (по умолчанию сегодня)
   * @returns объект с информацией о стрике
   */
  static calculateCurrentStreak(
    tasks: Task[],
    currentDate: Date = new Date()
  ): {
    currentStreak: number;
    lastCompletedDate: string | null;
  } {
    // Группируем задачи по датам и считаем выполненные
    const tasksByDate = this.groupTasksByDate(tasks);

    let currentStreak = 0;
    let lastCompletedDate: string | null = null;

    // Идем назад от текущей даты
    const today = new Date(currentDate);
    today.setHours(0, 0, 0, 0);

    // Проверяем, есть ли выполненные задачи сегодня
    const todayString = this.formatDate(today);
    const todayTasks = tasksByDate[todayString] || [];
    const todayCompletedTasks = todayTasks.filter((task) => task.is_done);

    // Если сегодня есть выполненные задачи, начинаем с сегодня
    // Если нет - начинаем с вчера
    const startDay = todayCompletedTasks.length > 0 ? 0 : 1;

    for (let i = startDay; i < 365; i++) {
      // Максимум год назад
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateString = this.formatDate(checkDate);

      const dayTasks = tasksByDate[dateString] || [];
      const completedTasks = dayTasks.filter((task) => task.is_done);

      // Если есть выполненные задачи в этот день
      if (completedTasks.length > 0) {
        currentStreak++;
        if (i === startDay) {
          lastCompletedDate = dateString;
        }
      } else {
        // Если в этот день нет выполненных задач, стрик прерывается
        break;
      }
    }

    return {
      currentStreak,
      lastCompletedDate,
    };
  }

  /**
   * Подсчитывает лучший стрик выполнения задач
   * @param tasks - массив всех задач
   * @returns объект с информацией о лучшем стрике
   */
  static calculateBestStreak(tasks: Task[]): {
    bestStreak: number;
    bestStreakStart: string | null;
    bestStreakEnd: string | null;
  } {
    const tasksByDate = this.groupTasksByDate(tasks);

    // Получаем текущую дату для фильтрации будущих дат
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayString = this.formatDate(today);

    // Получаем все даты, где есть выполненные задачи, исключая будущие
    const datesWithCompletedTasks = Object.keys(tasksByDate)
      .filter((date) => {
        // Исключаем будущие даты
        if (date > todayString) {
          return false;
        }

        const dayTasks = tasksByDate[date];
        const completedTasks = dayTasks.filter((task) => task.is_done);
        return completedTasks.length > 0;
      })
      .sort();

    let bestStreak = 0;
    let currentStreak = 0;
    let bestStreakStart: string | null = null;
    let bestStreakEnd: string | null = null;
    let streakStart: string | null = null;

    for (let i = 0; i < datesWithCompletedTasks.length; i++) {
      const currentDate = datesWithCompletedTasks[i];

      if (i === 0) {
        // Первая дата - начинаем новый стрик
        currentStreak = 1;
        streakStart = currentDate;
        bestStreak = 1;
        bestStreakStart = currentDate;
        bestStreakEnd = currentDate;
      } else {
        const prevDate = datesWithCompletedTasks[i - 1];
        const currentDateObj = new Date(currentDate);
        const prevDateObj = new Date(prevDate);
        const daysDiff = Math.floor(
          (currentDateObj.getTime() - prevDateObj.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysDiff === 1) {
          // Следующий день - продолжаем стрик
          currentStreak++;
          if (currentStreak > bestStreak) {
            bestStreak = currentStreak;
            bestStreakStart = streakStart;
            bestStreakEnd = currentDate;
          }
        } else {
          // Пропуск дней - начинаем новый стрик
          currentStreak = 1;
          streakStart = currentDate;
          if (currentStreak > bestStreak) {
            bestStreak = currentStreak;
            bestStreakStart = streakStart;
            bestStreakEnd = currentDate;
          }
        }
      }
    }

    return {
      bestStreak,
      bestStreakStart,
      bestStreakEnd,
    };
  }

  /**
   * Группирует задачи по датам
   * @param tasks - массив задач
   * @returns объект с задачами, сгруппированными по датам
   */
  private static groupTasksByDate(tasks: Task[]): Record<string, Task[]> {
    const grouped: Record<string, Task[]> = {};

    tasks.forEach((task) => {
      if (task.task_date) {
        const dateString = task.task_date.slice(0, 10); // YYYY-MM-DD
        if (!grouped[dateString]) {
          grouped[dateString] = [];
        }
        grouped[dateString].push(task);
      }
    });

    return grouped;
  }

  /**
   * Форматирует дату в строку YYYY-MM-DD
   * @param date - дата для форматирования
   * @returns отформатированная строка даты
   */
  private static formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Форматирует дату для отображения (сегодня/вчера/дата)
   * @param dateString - строка даты в формате YYYY-MM-DD
   * @param t - функция перевода
   * @returns отформатированная строка
   */
  static formatDateForDisplay(dateString: string, t: (key: string) => string): string {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayString = this.formatDate(today);
    const yesterdayString = this.formatDate(yesterday);

    if (dateString === todayString) {
      return t('stats.streaks.today');
    } else if (dateString === yesterdayString) {
      return t('stats.streaks.yesterday');
    } else {
      return dateString;
    }
  }

  /**
   * Получает полную статистику стриков
   * @param tasks - массив всех задач
   * @returns полная статистика стриков
   */
  static getStreakStats(tasks: Task[]): {
    currentStreak: number;
    bestStreak: number;
    lastCompletedDate: string | null;
    bestStreakStart: string | null;
    bestStreakEnd: string | null;
  } {
    const current = this.calculateCurrentStreak(tasks);
    const best = this.calculateBestStreak(tasks);

    return {
      currentStreak: current.currentStreak,
      bestStreak: best.bestStreak,
      lastCompletedDate: current.lastCompletedDate,
      bestStreakStart: best.bestStreakStart,
      bestStreakEnd: best.bestStreakEnd,
    };
  }
}
