import type { Task } from '../../types/dbTypes';

export class ActivityUtils {
  /**
   * Получить данные активности для календаря
   * @param tasks - массив всех задач
   * @param month - месяц для анализа
   * @returns объект с данными активности
   */
  static getActivityData(tasks: Task[], month: Date) {
    const completedTasks = tasks.filter((task) => task.is_done);

    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
    const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    // Преобразуем день недели для календаря, начинающегося с понедельника
    // 0=Вс -> 6, 1=Пн -> 0, 2=Вт -> 1, ..., 6=Сб -> 5
    const firstDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    const daysInMonth = lastDay.getDate();

    // Генерируем данные для каждого дня месяца
    const days = Array.from({ length: daysInMonth }, (_, index) => {
      const currentDate = new Date(month.getFullYear(), month.getMonth(), index + 1);
      const dateString = currentDate.toISOString().split('T')[0];

      // Считаем выполненные задачи за этот день
      const tasksOnDate = completedTasks.filter((task) => task.task_date === dateString);
      const doneToday = tasksOnDate.length;

      // Вычисляем интенсивность (базируемся на среднем количестве задач в день)
      const avgPerDay = this.getAverageTasksPerDay(completedTasks, month);
      const intensity = Math.min(100, (doneToday / Math.max(avgPerDay, 1)) * 100);

      return {
        day: index + 1,
        count: doneToday,
        intensity: intensity,
        date: dateString,
      };
    });

    return {
      firstDayOfWeek,
      daysInMonth,
      days,
      emptyCells: Array(firstDayOfWeek).fill(null),
    };
  }

  /**
   * Получить среднее количество задач в день за месяц
   * @param completedTasks - массив выполненных задач
   * @param month - месяц для анализа
   * @returns среднее количество задач в день
   */
  private static getAverageTasksPerDay(completedTasks: Task[], month: Date) {
    const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
    const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);

    const tasksInMonth = completedTasks.filter((task) => {
      if (!task.task_date) return false;
      const taskDate = new Date(task.task_date);
      return taskDate >= monthStart && taskDate <= monthEnd;
    });

    const daysInMonth = monthEnd.getDate();
    return tasksInMonth.length / daysInMonth;
  }

  /**
   * Получить статистику активности за период
   * @param tasks - массив всех задач
   * @param startDate - начальная дата
   * @param endDate - конечная дата
   * @returns статистика активности
   */
  static getActivityStats(tasks: Task[], startDate: Date, endDate: Date) {
    const completedTasks = tasks.filter((task) => task.is_done);

    const tasksInPeriod = completedTasks.filter((task) => {
      if (!task.task_date) return false;
      const taskDate = new Date(task.task_date);
      return taskDate >= startDate && taskDate <= endDate;
    });

    const totalDays =
      Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const activeDays = new Set(tasksInPeriod.map((task) => task.task_date)).size;

    return {
      totalTasks: tasksInPeriod.length,
      activeDays: activeDays,
      totalDays: totalDays,
      averagePerDay: tasksInPeriod.length / totalDays,
      activityRate: (activeDays / totalDays) * 100,
    };
  }

  /**
   * Получить цвет интенсивности для дня
   * @param intensity - интенсивность (0-100)
   * @returns HSL цвет
   */
  static getIntensityColor(intensity: number): string {
    const lightness = Math.max(20, 90 - intensity * 0.4);
    return `hsl(120, 50%, ${lightness}%)`;
  }
}
