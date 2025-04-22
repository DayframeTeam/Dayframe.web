import { Task } from '../types/dbTypes';

export class TaskFilter {
  // Фильтрует задачи по дате и возвращает массив special_id
  static filterByDateGetIds(tasks: Task[], date: string): string[] {
    return tasks.reduce<string[]>((ids, task) => {
      if (task.task_date === date && task.special_id) {
        ids.push(task.special_id);
      }
      return ids;
    }, []);
  }
}
