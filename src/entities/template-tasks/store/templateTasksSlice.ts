import { createEntityAdapter, createSlice, createSelector, EntityState } from '@reduxjs/toolkit';
import type { TemplateTask } from '../../../types/dbTypes';
import type { RootState } from '../../../store';
import { Sorter } from '../../../utils/sort';
import { TemplateTaskUtils } from '../template.tasks.utils';

/**
 * EntityAdapter для шаблонных задач
 */
const templateTasksAdapter = createEntityAdapter<TemplateTask, string>({
  selectId: (task) => TemplateTaskUtils.createTemplateTaskUniqueKey(task),
  sortComparer: Sorter.complexSort,
});

/**
 * Интерфейс состояния шаблонных задач
 */
interface TemplateTasksState extends EntityState<TemplateTask, string> {
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

/**
 * Redux Slice для шаблонных задач
 */
const templateTasksSlice = createSlice({
  name: 'templateTasks',
  initialState: templateTasksAdapter.getInitialState<Omit<TemplateTasksState, keyof EntityState<TemplateTask, string>>>({
    isLoading: false,
    error: null,
    lastUpdated: null,
  }),
  reducers: {
    setTemplateTasks: (state, action) => {
      templateTasksAdapter.setAll(state, action.payload);
      state.lastUpdated = new Date().toISOString();
    },
    addTemplateTask: (state, action) => {
      templateTasksAdapter.addOne(state, action.payload);
      state.lastUpdated = new Date().toISOString();
    },
    updateOneTemplateTask: (state, action) => {
      templateTasksAdapter.updateOne(state, action.payload);
      state.lastUpdated = new Date().toISOString();
    },
    deleteTemplateTask: (state, action) => {
      templateTasksAdapter.removeOne(state, action.payload);
      state.lastUpdated = new Date().toISOString();
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

// Экспортируем действия
export const {
  setTemplateTasks,
  addTemplateTask,
  updateOneTemplateTask,
  deleteTemplateTask,
  setLoading,
  setError,
} = templateTasksSlice.actions;

// Экспортируем редьюсер
export default templateTasksSlice.reducer;

/**
 * Базовые селекторы
 */
const baseSelectors = templateTasksAdapter.getSelectors((state: RootState) => state.templateTasks);

/**
 * Селекторы для шаблонных задач
 */
export class TemplateTaskSelectors {
  /**
   * Получить все шаблонные задачи
   */
  static selectAllTemplateTasks = baseSelectors.selectAll;

  /**
   * Получить шаблонную задачу
   */
  static selectTemplateTaskBySpecialId = baseSelectors.selectById;

  /**
   * Получить АКТИВНЫЕ шаблонные задачи для указанной даты
   */
  static selectTemplateTasksByDate = createSelector(
    [baseSelectors.selectAll, (_: RootState, date: string) => date],
    (tasks, date) => {
      // 1) номер дня: Mon=1 … Sun=7
      const jsDay = new Date(date).getDay(); // 0..6, где 0=Sun
      const dayNumber = jsDay === 0 ? 7 : jsDay; // 1..7

      return tasks.filter((task) => {
        if (!task.is_active) return false;
        // 2) парсим повторение
        const rule = TemplateTaskUtils.parseRepeatRule(task.repeat_rule);

        // 3) если массив
        if (Array.isArray(rule)) {
          // ежедневные
          if (rule.length === 7) {
            return true;
          }
          // кастомные (дни недели)
          return rule.includes(dayNumber);
        }

        // 4) weekly
        if (rule === 'weekly') {
          return false;
        }

        // 5) quests — не создаём автоматически
        return false;
      });
    }
  );

  /**
   * Получить ежедневные шаблонные задачи
   */
  static selectDailyTemplateTasks = createSelector([baseSelectors.selectAll], (tasks) =>
    tasks.filter((task) => {
      const rule = TemplateTaskUtils.parseRepeatRule(task.repeat_rule);
      return Array.isArray(rule) && rule.length === 7;
    })
  );

  /**
   * Получить еженедельные шаблонные задачи
   */
  static selectWeeklyTemplateTasks = createSelector([baseSelectors.selectAll], (tasks) =>
    tasks.filter((task) => {
      const rule = TemplateTaskUtils.parseRepeatRule(task.repeat_rule);
      return rule === 'weekly';
    })
  );

  /**
   * Получить квестовые шаблонные задачи
   */
  static selectQuestsTemplateTasks = createSelector([baseSelectors.selectAll], (tasks) =>
    tasks.filter((task) => {
      const rule = TemplateTaskUtils.parseRepeatRule(task.repeat_rule);
      return rule === 'quests';
    })
  );

  /**
   * Получить пользовательские шаблонные задачи
   */
  static selectCustomTemplateTasks = createSelector([baseSelectors.selectAll], (tasks) =>
    tasks.filter((task) => {
      const rule = TemplateTaskUtils.parseRepeatRule(task.repeat_rule);
      return rule.length !== 7 && rule !== 'weekly' && rule !== 'quests';
    })
  );
}
