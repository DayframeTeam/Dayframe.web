import { Task } from '../../types/dbTypes';
import { selectAllTasks } from '../task/store/tasksSlice';
import { format, parseISO } from 'date-fns';
import { createSelector } from '@reduxjs/toolkit';

/**
 * Календарный сервис для работы с задачами по датам
 */
export const calendarService = {
  /**
   * Селектор для получения задач по дате (для использования с useSelector)
   * @param date - Дата, для которой нужны задачи
   * @returns Селектор, возвращающий массив задач для указанной даты
   */
  selectTasksByDate: (date: Date) => {
    // Преобразуем дату в строку для использования в кеше селектора
    const dateString = format(date, 'yyyy-MM-dd');

    // Создаем мемоизированный селектор для конкретной даты
    return createSelector(selectAllTasks, (tasks: Task[]) => {
      return tasks.filter((task) => {
        if (!task.task_date) return false;

        const taskDate = parseISO(task.task_date);
        return format(taskDate, 'yyyy-MM-dd') === dateString;
      });
    });
  },

  /**
   * Селектор для получения задач на указанную дату, отсортированных по времени начала
   * @param date - Дата, для которой нужны отсортированные задачи
   * @returns Селектор, возвращающий отсортированные задачи на указанную дату
   */
  selectTasksSortedByTime: (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');

    return createSelector(selectAllTasks, (tasks: Task[]) => {
      // Фильтруем задачи на указанную дату
      const filteredTasks = tasks.filter((task) => {
        if (!task.task_date) return false;

        const taskDate = parseISO(task.task_date);
        return format(taskDate, 'yyyy-MM-dd') === dateString;
      });

      // Сортируем отфильтрованные задачи по времени
      return calendarService.sortTasksByTime(filteredTasks);
    });
  },

  /**
   * Сортирует задачи по времени начала
   * @param tasks - Массив задач для сортировки
   * @returns Отсортированный массив задач (сначала с временем, затем без)
   */
  sortTasksByTime: (tasks: Task[]): Task[] => {
    return [...tasks].sort((a, b) => {
      const aTime = a.start_time;
      const bTime = b.start_time;

      // Если у обоих нет времени, оставляем их как есть
      if (!aTime && !bTime) return 0;
      // Если у a нет времени — отправляем его в конец
      if (!aTime) return 1;
      // Если у b нет времени — отправляем его в конец
      if (!bTime) return -1;

      // Иначе сравниваем строки "HH:MM" в алфавитном порядке
      return aTime.localeCompare(bTime);
    });
  },
};
