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

  /**
   * Возвращает special_id шаблонных задач, которые нужно «создать» на указанную дату:
   * - Ежедневные (repeat_rule = [1,2,3,4,5,6,7])
   * - Кастомные, включающие номер дня недели (1=Mon…7=Sun)
   * - Weekly
   * При этом исключаются те, чей special_id уже в existingIds.
   *
   * @param templates Массив всех TemplateTask
   * @param existingIds special_id уже созданных задач на дату
   * @param date Строка "YYYY-MM-DD"
   */
  // static getTaskSpecialIdsForDate(
  //   templates: TemplateTask[],
  //   existingIds: string[],
  //   date: string
  // ): string[] {
  //   // 1) номер дня: Mon=1 … Sun=7
  //   const jsDay = new Date(date).getDay(); // 0..6, где 0=Sun
  //   const dayNumber = jsDay === 0 ? 7 : jsDay; // 1..7

  //   return templates
  //     .filter((t) => {
  //       // 2) пропускаем, если уже создана
  //       if (existingIds.includes(t.special_id)) {
  //         return false;
  //       }

  //       // 3) парсим повторение
  //       const rule = this.parseRepeatRule(t.repeat_rule);

  //       // 4) если массив
  //       if (Array.isArray(rule)) {
  //         // ежедневные
  //         if (rule.length === 7) {
  //           return true;
  //         }
  //         // кастомные (дни недели)
  //         return rule.includes(dayNumber);
  //       }

  //       // 5) weekly
  //       if (rule === 'weekly') {
  //         return false;
  //       }

  //       // 6) quests — не создаём автоматически
  //       return false;
  //     })
  //     .map((t) => t.special_id);
  // }
}

// Export the createEmptyTask function directly for backward compatibility
export const createEmptyTemplateTask = TemplateTaskUtils.createEmptyTemplateTask;
