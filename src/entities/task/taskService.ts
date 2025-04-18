import { Task } from '../../types/dbTypes';
import api from '../../api/http/axios';
import { store } from '../../store';
import { handleApiError } from '../../shared/errors';
import {
  addTask,
  deleteTask,
  setTasks,
  updateOneTask,
  setLoading,
  setError,
} from './store/tasksSlice';
import { setUserExp } from '../user/store/userSlice';

const url = '/tasks';

export type TaskService = {
  fetchAndStoreAll: () => Promise<void>;
  createTask: (taskData: Partial<Task>) => Promise<Task>;
  deleteTask: (taskId: number) => Promise<void>;
  updateTaskStatus: (taskId: number, isDone: boolean) => Promise<void>;
  updateTask: (taskId: number, taskData: Partial<Task>) => Promise<Task>;
  updateSubtaskStatus: (subtaskId: number, isDone: boolean) => Promise<void>;
};

// Define response types
interface TaskResponse {
  task?: Task;
  userExp?: number;
}

/**
 * Service for managing tasks with database and store integration
 */
export const taskService: TaskService = {
  /**
   * Fetches all tasks from the server and stores them in Redux
   */
  async fetchAndStoreAll(): Promise<void> {
    store.dispatch(setLoading(true));

    try {
      const response = await api.get<Task[]>(url);
      // Сохраняем все задачи в store
      store.dispatch(setTasks(response.data));
    } catch (error) {
      const appError = handleApiError(error, 'taskService.fetchAndStoreAll');
      console.error(appError.message);
      store.dispatch(setError(appError.message));
      throw appError;
    } finally {
      store.dispatch(setLoading(false));
    }
  },

  /**
   * Creates a new task and updates Redux store
   * @param taskData - Partial task data
   * @returns Created task
   */
  async createTask(taskData: Partial<Task>): Promise<Task> {
    store.dispatch(setLoading(true));

    try {
      const response = await api.post<Task>(url, taskData);
      const createdTask = response.data;

      // Точечное обновление - добавляем только одну задачу
      store.dispatch(addTask(createdTask));

      return createdTask;
    } catch (error) {
      const appError = handleApiError(error, 'taskService.createTask');
      console.error(appError.message);
      store.dispatch(setError(appError.message));
      throw appError;
    } finally {
      store.dispatch(setLoading(false));
    }
  },

  /**
   * Deletes a task by ID and updates Redux store
   * @param taskId - Task ID
   */
  async deleteTask(taskId: number): Promise<void> {
    store.dispatch(setLoading(true));

    try {
      await api.delete(`${url}/${taskId}`);

      // Находим задачу по ID для получения special_id
      const state = store.getState();
      const task = Object.values(state.tasks.entities).find((t) => t?.id === taskId);

      if (task?.special_id) {
        // Точечное обновление - удаляем только одну задачу по special_id
        store.dispatch(deleteTask(task.special_id));
      } else {
        console.warn(`Task with id=${taskId} not found in store`);
      }
    } catch (error) {
      const appError = handleApiError(error, 'taskService.deleteTask');
      console.error(appError.message);
      store.dispatch(setError(appError.message));
      throw appError;
    } finally {
      store.dispatch(setLoading(false));
    }
  },

  /**
   * Updates task status and handles XP changes
   * @param taskId - Task ID
   * @param isDone - New status
   */
  async updateTaskStatus(taskId: number, isDone: boolean): Promise<void> {
    store.dispatch(setLoading(true));

    try {
      const response = await api.patch<TaskResponse>(`${url}/is_done/${taskId}`, {
        is_done: isDone,
      });

      if (response.data.task) {
        // Точечное обновление - обновляем только одну задачу
        store.dispatch(
          updateOneTask({
            id: response.data.task.special_id,
            changes: response.data.task,
          })
        );
      }

      if (response.data.userExp) {
        store.dispatch(setUserExp(response.data.userExp));
      }
    } catch (error) {
      const appError = handleApiError(error, 'taskService.updateTaskStatus');
      console.error(appError.message);
      store.dispatch(setError(appError.message));
      throw appError;
    } finally {
      store.dispatch(setLoading(false));
    }
  },

  /**
   * Updates task properties
   * @param taskId - Task ID
   * @param taskData - Updated task data
   * @returns Updated task
   */
  async updateTask(taskId: number, taskData: Partial<Task>): Promise<Task> {
    store.dispatch(setLoading(true));

    try {
      const response = await api.patch<Task>(`${url}/${taskId}`, taskData);
      const updatedTask = response.data;

      // Точечное обновление - обновляем только одну задачу
      store.dispatch(
        updateOneTask({
          id: updatedTask.special_id,
          changes: updatedTask,
        })
      );

      return updatedTask;
    } catch (error) {
      const appError = handleApiError(error, 'taskService.updateTask');
      console.error(appError.message);
      store.dispatch(setError(appError.message));
      throw appError;
    } finally {
      store.dispatch(setLoading(false));
    }
  },

  /**
   * Updates subtask status
   * @param subtaskId - Subtask ID
   * @param isDone - New status
   */
  async updateSubtaskStatus(subtaskId: number, isDone: boolean): Promise<void> {
    store.dispatch(setLoading(true));

    try {
      const response = await api.patch<TaskResponse>(`${url}/subtasks/${subtaskId}`, {
        is_done: isDone,
      });

      if (response.data.task) {
        // Точечное обновление - обновляем только родительскую задачу
        store.dispatch(
          updateOneTask({
            id: response.data.task.special_id,
            changes: response.data.task,
          })
        );
      }

      if (response.data.userExp) {
        store.dispatch(setUserExp(response.data.userExp));
      }
    } catch (error) {
      const appError = handleApiError(error, 'taskService.updateSubtaskStatus');
      console.error(appError.message);
      store.dispatch(setError(appError.message));
      throw appError;
    } finally {
      store.dispatch(setLoading(false));
    }
  },
};
