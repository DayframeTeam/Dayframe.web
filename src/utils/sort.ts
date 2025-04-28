import type { Task, TemplateTask } from '../types/dbTypes';

export class Sorter {
  /**
   * Комплексная сортировка задач по следующему приоритету:
   * 1. Задачи с временем начала (по возрастанию)
   * 2. Задачи с временем окончания (по возрастанию)
   * 3. Задачи с высоким приоритетом в начале
   * 4. При равенстве всех критериев - по ID
   */
  static complexSort(a: Task | TemplateTask, b: Task | TemplateTask): number {
    // 1. Сначала сортируем по времени начала
    if (a.start_time && b.start_time) {
      return a.start_time.localeCompare(b.start_time);
    }

    // Задачи с временем начала всегда перед задачами без времени
    if (a.start_time && !b.start_time) return -1;
    if (!a.start_time && b.start_time) return 1;

    // 2. Если нет времени начала, сортируем по времени окончания
    if (a.end_time && b.end_time) {
      return a.end_time.localeCompare(b.end_time);
    }

    // Задачи с временем окончания перед задачами без времени окончания
    if (a.end_time && !b.end_time) return -1;
    if (!a.end_time && b.end_time) return 1;

    // 3. Сортировка по приоритету (high > medium > low)
    return Sorter.sortByPriority(a, b);
  }

  /**
   * Сортировка по приоритету
   * High (3) -> Medium (2) -> Low (1) -> Undefined (0)
   */
  static sortByPriority(a: Task | TemplateTask, b: Task | TemplateTask): number {
    const priorityValue = {
      high: 3,
      medium: 2,
      low: 1,
      undefined: 0,
    };

    const aValue = priorityValue[a.priority as keyof typeof priorityValue] || 0;
    const bValue = priorityValue[b.priority as keyof typeof priorityValue] || 0;

    // Высокий приоритет идет первым (обратный порядок)
    if (aValue !== bValue) {
      return bValue - aValue;
    }

    // Если приоритеты равны, сортируем по ID для стабильной сортировки
    return a.id - b.id;
  }
}
