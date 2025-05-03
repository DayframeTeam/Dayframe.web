/**
 * tasksSlice.ts
 *
 * Этот файл определяет структуру хранения задач в Redux store и
 * предоставляет все необходимые действия и селекторы для работы с ними.
 * Используется EntityAdapter для нормализованного хранения данных задач,
 * что обеспечивает эффективное точечное обновление и доступ к данным.
 */

import { createEntityAdapter, createSlice, createSelector, EntityState } from '@reduxjs/toolkit';
import type { Task } from '../../../types/dbTypes';
import type { RootState } from '../../../store';
import { toLocalDateString } from '../../../utils/dateUtils';
import { Sorter } from '../../../utils/sort';
import { TaskUtils } from '../tasks.utils';

/**
 * EntityAdapter - специальный инструмент Redux Toolkit для работы с коллекциями объектов.
 * Преимущества:
 * - Нормализованное хранение данных (как Map с ключами)
 * - Эффективные CRUD операции
 * - Встроенная оптимизация производительности
 * - Автоматическая генерация селекторов
 */
const tasksAdapter = createEntityAdapter<Task, string>({
  // Определяем, какое поле будет использоваться как ключ (ID) для хранения задач
  selectId: (task) => TaskUtils.createTaskUniqueKey(task),

  // Используем комплексную сортировку задач
  sortComparer: Sorter.complexSort,
});

/**
 * Интерфейс состояния задач
 * Расширяет базовый интерфейс EntityState дополнительными полями:
 * - isLoading: флаг загрузки данных
 * - error: информация об ошибке, если есть
 * - lastUpdated: время последнего обновления для отслеживания изменений
 */
interface TasksState extends EntityState<Task, string> {
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

/**
 * Redux Slice - модуль для работы с определенной частью хранилища Redux
 * Объединяет в себе:
 * - начальное состояние
 * - редьюсеры (функции для изменения состояния)
 * - генерацию действий (actions)
 */
const tasksSlice = createSlice({
  name: 'tasks', // Имя slice, используется как префикс в типах действий

  // Начальное состояние с использованием структуры от tasksAdapter
  initialState: tasksAdapter.getInitialState<Omit<TasksState, keyof EntityState<Task, string>>>({
    isLoading: false,
    error: null,
    lastUpdated: null,
  }),

  // Редьюсеры - функции, которые изменяют состояние при диспатче соответствующих действий
  reducers: {
    // Заменяет весь список задач (например, при начальной загрузке)
    setTasks: (state, action) => {
      tasksAdapter.setAll(state, action.payload);
      state.lastUpdated = new Date().toISOString();
    },

    // Добавляет одну новую задачу в хранилище
    addTask: (state, action) => {
      tasksAdapter.addOne(state, action.payload);
      state.lastUpdated = new Date().toISOString();
    },

    // Обновляет определенные поля существующей задачи
    // Важно: обновляется только задача с указанным ID и только указанные поля
    updateOneTask: (state, action) => {
      tasksAdapter.updateOne(state, action.payload);
      state.lastUpdated = new Date().toISOString();
    },

    // Удаляет одну задачу из хранилища по ID
    deleteTask: (state, action) => {
      tasksAdapter.removeOne(state, action.payload);
      state.lastUpdated = new Date().toISOString();
    },

    // Устанавливает флаг загрузки (показывает, идет ли загрузка данных)
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    // Устанавливает сообщение об ошибке (если произошла ошибка при запросе)
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

// Экспортируем действия, чтобы их можно было диспатчить из других частей приложения
export const { setTasks, addTask, updateOneTask, deleteTask, setLoading, setError } =
  tasksSlice.actions;

// Экспортируем редьюсер для подключения к корневому редьюсеру в store
export default tasksSlice.reducer;

/**
 * Стандартные селекторы, созданные EntityAdapter
 */
const baseSelectors = tasksAdapter.getSelectors((state: RootState) => state.tasks);

/**
 * TaskSelectors - класс, содержащий все селекторы для работы с задачами
 * Централизованное место для всех функций выборки данных из Redux-хранилища
 */
class TaskSelectors {
  /**
   * Получить все задачи в виде массива, отсортированные согласно sortComparer
   */
  static selectAllTasks = baseSelectors.selectAll;

  /**
   * Получить задачу по ID
   */
  static selectTaskById = baseSelectors.selectById;

  /**
   * Получить массив всех ID задач
   */
  static selectTaskIds = baseSelectors.selectIds;

  /**
   * Получить объект с задачами (ключи - ID, значения - задачи)
   */
  static selectTaskEntities = baseSelectors.selectEntities;

  /**
   * Получить статус загрузки
   */
  static selectTasksLoading = (state: RootState) => state.tasks.isLoading;

  /**
   * Получить сообщение об ошибке
   */
  static selectTasksError = (state: RootState) => state.tasks.error;

  /**
   * Вспомогательная функция для сравнения дат
   * @private использовании только внутри класса
   */
  private static matchesDate(taskDate: string | undefined, targetDate: string): boolean {
    // Для TodayPage мы хотим показывать только задачи с датой, совпадающей с сегодняшней
    if (!taskDate) return false; // Задачи без даты НЕ показываются

    // Нормализуем форматы даты через вспомогательную функцию
    const normalizedTaskDate = toLocalDateString(taskDate);
    const normalizedTargetDate = toLocalDateString(targetDate);

    return normalizedTaskDate === normalizedTargetDate;
  }

  /**
   * Селектор для получения задач по дате
   * @param state - состояние Redux
   * @param date - дата, по которой фильтруются задачи
   * @returns массив задач, соответствующих указанной дате
   */
  static selectTasksByDate = createSelector(
    [TaskSelectors.selectAllTasks, (_, date: string) => date],
    (tasks, date) => tasks.filter((task) => TaskSelectors.matchesDate(task.task_date, date))
  );

  /**
   * Селектор для получения ID задач по дате
   * @param state - состояние Redux
   * @param date - дата, по которой фильтруются задачи
   * @returns массив ID задач на указанную дату
   */
  static selectTaskIdsByDate = createSelector(
    [TaskSelectors.selectTasksByDate, (_, date: string) => date],
    (tasks) => tasks.map((task) => TaskUtils.createTaskUniqueKey(task))
  );

  /**
   * Селектор для получения задач с указанной датой И задач без даты
   * Полезен для представлений, которые должны показывать задачи
   * определенной даты и "плавающие" задачи без привязки к дате
   *
   * @param state - состояние Redux
   * @param date - дата, по которой фильтруются задачи
   * @returns массив задач на указанную дату плюс задачи без даты
   */
  static selectTasksByDateIncludingUndated = createSelector(
    [TaskSelectors.selectAllTasks, (_, date: string) => date],
    (tasks, date) =>
      tasks.filter((task) => {
        // Включаем задачи без даты
        if (!task.task_date) return true;

        // И задачи с совпадающей датой
        const normalizedTaskDate = toLocalDateString(task.task_date);
        const normalizedTargetDate = toLocalDateString(date);

        return normalizedTaskDate === normalizedTargetDate;
      })
  );

  /**
   * Селектор для получения ID задач с указанной датой И задач без даты
   *
   * @param state - состояние Redux
   * @param date - дата, по которой фильтруются задачи
   * @returns массив ID задач на указанную дату плюс задачи без даты
   */
  static selectTaskIdsByDateIncludingUndated = createSelector(
    [TaskSelectors.selectTasksByDateIncludingUndated, (_, date: string) => date],
    (tasks) => tasks.map((task) => TaskUtils.createTaskUniqueKey(task))
  );
}

// Экспортируем все селекторы из класса TaskSelectors для использования в компонентах
export const {
  selectAllTasks,
  selectTaskById,
  selectTaskIds,
  selectTaskEntities,
  selectTasksLoading,
  selectTasksError,
  selectTasksByDate,
  selectTaskIdsByDate,
  selectTasksByDateIncludingUndated,
  selectTaskIdsByDateIncludingUndated,
} = TaskSelectors;
