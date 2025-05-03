import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../store';
import { Sorter } from '../../utils/sort';
import { TemplateTaskSelectors } from '../template-tasks/store/templateTasksSlice';
import { selectTasksByDate, selectTasksByDateIncludingUndated } from '../task/store/tasksSlice';
import { TemplateTaskUtils } from '../template-tasks/template.tasks.utils';
import { TaskUtils } from '../task/tasks.utils';

/**
 * Класс с общими селекторами для работы с задачами
 */
export class CommonTaskSelectors {
  /**
   * Получить отсортированный список уникальных ключей задач для указанной даты:
   * - Сначала все регулярные задачи (с датой + без даты)
   * - Затем только те шаблонные, которых ещё нет в регулярных
   */
  static selectSortedTaskIdsForDate = createSelector(
    [
      (state: RootState, date: string) => selectTasksByDateIncludingUndated(state, date),
      (state: RootState, date: string) =>
        TemplateTaskSelectors.selectTemplateTasksByDate(state, date),
    ],
    (regularTasks, templateTasks) => {
      // 1) Собираем set уже встреченных special_id
      const existingIds = new Set(regularTasks.map((t) => t.special_id));

      // 2) Отфильтровываем шаблоны, которых ещё нет
      const filteredTemplates = templateTasks.filter((t) => !existingIds.has(t.special_id));

      // 3) Объединяем и сортируем по вашей логике
      const combined = [...regularTasks, ...filteredTemplates];
      combined.sort(Sorter.complexSort);

      // 4) Превращаем задачи в уникальные ключи
      return combined.map((task) =>
        'is_active' in task
          ? TemplateTaskUtils.createTemplateTaskUniqueKey(task)
          : TaskUtils.createTaskUniqueKey(task)
      );
    }
  );

  /**
   * Для календаря: сначала «обычные» задачи на дату,
   * затем только те шаблоны, которые ещё не созданы,
   * всё вместе сортируем и возвращаем массив уникальных ключей.
   */
  static selectSortedTaskIdsByDateForCalendar = createSelector(
    [
      (state: RootState, date: string) => selectTasksByDate(state, date),
      (state: RootState, date: string) =>
        TemplateTaskSelectors.selectTemplateTasksByDate(state, date),
    ],
    (regularTasks, templateTasks) => {
      // 1) Собираем set уже встреченных special_id
      const existingIds = new Set(regularTasks.map((t) => t.special_id));

      // 2) Отфильтровываем шаблоны без дубликатов
      const filteredTemplates = templateTasks.filter((t) => !existingIds.has(t.special_id));

      // 3) Объединяем и сортируем
      const combined = [...regularTasks, ...filteredTemplates];
      combined.sort(Sorter.complexSort);

      // 4) Мапим в уникальные ключи
      return combined.map((task) =>
        'is_active' in task
          ? TemplateTaskUtils.createTemplateTaskUniqueKey(task)
          : TaskUtils.createTaskUniqueKey(task)
      );
    }
  );
}
