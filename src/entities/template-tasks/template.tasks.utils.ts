import { nanoid } from 'nanoid';
import { RepeatRule, TemplateTask, Task } from '../../types/dbTypes';

export class TemplateTaskUtils {
  static createEmptyTemplateTask(repeat_rule?: RepeatRule): TemplateTask {
    return {
      id: 0,
      title: '',
      description: undefined,
      category: undefined,
      priority: undefined,
      exp: 0,
      start_time: undefined,
      end_time: undefined,
      user_id: 0,
      created_at: '',
      special_id: nanoid(),
      is_active: true,
      start_active_date: undefined,
      end_active_date: undefined,
      repeat_rule: repeat_rule ?? `quests`,
      subtasks: [],
    };
  }

  static parseRepeatRule(raw: unknown): RepeatRule {
    // 1) Если уже массив чисел
    if (Array.isArray(raw) && raw.every((item) => typeof item === 'number')) {
      return raw as number[];
    }

    // 2) Если строка — попытаемся распарсить JSON
    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.every((item) => typeof item === 'number')) {
          return parsed as number[];
        }
        if (parsed === 'weekly' || parsed === 'quests') {
          return parsed;
        }
      } catch {
        // если JSON.parse не прокатил, пробуем обычное сравнение
        if (raw === 'weekly' || raw === 'quests') {
          return raw;
        }
      }
    }

    // 3) Во всех остальных случаях — дефолт
    return [];
  }

  /**
   * Конвертирует шаблонную задачу в обычную задачу
   * @param templateTask Шаблонная задача
   * @param taskDate Дата для новой задачи
   * @returns Обычная задача
   */
  static convertTemplateToTask(templateTask: TemplateTask, taskDate: string): Task {
    const { ...taskFields } = templateTask;

    return {
      ...taskFields,
      is_done: false,
      task_date: taskDate ?? undefined,
      subtasks: templateTask.subtasks.map((subtask) => ({
        ...subtask,
        is_done: false,
        parent_task_id: 0, // Будет установлен после создания задачи
      })),
    };
  }

  //создаю уникальный ключ для стора и верстки
  static createTemplateTaskUniqueKey(task: TemplateTask): string {
    return `p${task.id}`;
  }
}

// Export the createEmptyTask function directly for backward compatibility
export const createEmptyTemplateTask = TemplateTaskUtils.createEmptyTemplateTask;
