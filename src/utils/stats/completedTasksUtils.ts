import type { Task } from '../../types/dbTypes';

export class CompletedTasksUtils {
  /**
   * Получить статистику выполненных задач
   * @param tasks - массив всех задач
   * @returns объект со статистикой
   */
  static getCompletedTasksStats(tasks: Task[]) {
    const completedTasks = tasks.filter((task) => task.is_done);

    // Задачи за все время
    const allTimeCount = completedTasks.length;

    // Задачи за текущий месяц
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const thisMonthCount = completedTasks.filter((task) => {
      if (!task.task_date) return false;
      const taskDate = new Date(task.task_date);
      return taskDate >= currentMonthStart && taskDate <= currentMonthEnd;
    }).length;

    // Задачи за сегодня
    const today = new Date().toISOString().split('T')[0];
    const todayCount = completedTasks.filter((task) => task.task_date === today).length;

    return {
      allTime: allTimeCount,
      thisMonth: thisMonthCount,
      today: todayCount,
    };
  }

  /**
   * Получить данные по месяцам для годового графика
   * @param tasks - массив всех задач
   * @param year - год (по умолчанию текущий)
   * @returns массив данных по месяцам
   */
  static getMonthlyData(tasks: Task[], year: number = new Date().getFullYear()) {
    const completedTasks = tasks.filter((task) => task.is_done);

    return Array.from({ length: 12 }, (_, monthIndex) => {
      const monthStart = new Date(year, monthIndex, 1);
      const monthEnd = new Date(year, monthIndex + 1, 0);

      return completedTasks.filter((task) => {
        if (!task.task_date) return false;
        const taskDate = new Date(task.task_date);
        return taskDate >= monthStart && taskDate <= monthEnd;
      }).length;
    });
  }

  /**
   * Получить статистику по категориям
   * @param tasks - массив всех задач
   * @returns объект с количеством задач по категориям
   */
  static getCategoryStats(tasks: Task[]) {
    const completedTasks = tasks.filter((task) => task.is_done);
    const categoryStats = new Map<string, number>();

    completedTasks.forEach((task) => {
      const category = task.category || 'other';
      categoryStats.set(category, (categoryStats.get(category) || 0) + 1);
    });

    return categoryStats;
  }

  /**
   * Получить статистику по приоритетам
   * @param tasks - массив всех задач
   * @returns объект с количеством задач по приоритетам
   */
  static getPriorityStats(tasks: Task[]) {
    const completedTasks = tasks.filter((task) => task.is_done);
    const priorityStats = new Map<string, number>();

    completedTasks.forEach((task) => {
      const priority = task.priority || 'none';
      priorityStats.set(priority, (priorityStats.get(priority) || 0) + 1);
    });

    return priorityStats;
  }

  /**
   * Получить общее время, потраченное на выполненные задачи
   * @param tasks - массив всех задач
   * @returns время в минутах
   */
  static getTotalTimeSpent(tasks: Task[]) {
    const completedTasks = tasks.filter((task) => task.is_done && task.start_time && task.end_time);

    return completedTasks.reduce((total, task) => {
      const startTime = new Date(`2000-01-01T${task.start_time}`);
      const endTime = new Date(`2000-01-01T${task.end_time}`);
      const timeSpent = Math.max(0, (endTime.getTime() - startTime.getTime()) / (1000 * 60));
      return total + timeSpent;
    }, 0);
  }
}
