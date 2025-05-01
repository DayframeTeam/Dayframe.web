import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../store';
import { Sorter } from '../../utils/sort';
import { TemplateTaskSelectors } from '../template-tasks/store/templateTasksSlice';
import { selectTasksByDateIncludingUndated } from '../task/store/tasksSlice';

/**
 * Селекторы для работы с обычными и шаблонными задачами
 */
export class CommonTaskSelectors {
  /**
   * Получить отсортированный список special_id для указанной даты
   * @param state - Состояние Redux store
   * @param date - Дата для которой нужно получить задачи
   * @returns Отсортированный массив special_id
   */
  static selectSortedTaskIdsForDate = createSelector(
    [
      (state: RootState, date: string) => selectTasksByDateIncludingUndated(state, date),
      (state: RootState, date: string) =>
        TemplateTaskSelectors.selectTemplateTasksByDate(state, date),
    ],
    (regularTasks, templateTasks) => {
      const sortedTasks = [...regularTasks, ...templateTasks].sort(Sorter.complexSort);
      return sortedTasks.map((task) => task.special_id);
    }
  );
}
