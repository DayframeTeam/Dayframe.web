import { Task } from '../../types/dbTypes';
import api from '../../api/http/axios';
import { store } from '../../store';
import { handleApiError } from '../../shared/errors';
import { addTask, deleteTask, setTasks, updateOneTask } from './store/tasksSlice';
import { setUserExp } from '../user/store/userSlice';

const url = '/tasks';

export type TaskService = {
  fetchAndStoreAll: () => Promise<void>;
  createTask: (taskData: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: number) => Promise<void>;
  updateTaskStatus: (taskId: number, isDone: boolean) => Promise<void>;
  updateTask: (taskId: number, taskData: Partial<Task>) => Promise<void>;
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
  async fetchAndStoreAll(): Promise<void> {
    try {
      const response = await api.get<Task[]>(url);
      store.dispatch(setTasks(response.data));
    } catch (error) {
      const appError = handleApiError(error, 'taskService.fetchAndStoreAll');
      console.error(appError.message);
      throw appError;
    }
  },

  async createTask(taskData: Partial<Task>): Promise<void> {
    try {
      const response = await api.post<Task>(url, taskData);
      store.dispatch(addTask(response.data));
    } catch (error) {
      const appError = handleApiError(error, 'taskService.createTask');
      console.error(appError.message);
      throw appError;
    }
  },

  async deleteTask(taskId: number): Promise<void> {
    try {
      await api.delete(`${url}/${taskId}`);

      // Поиск special_id по обычному id (для Redux-удаления)
      const state = store.getState();
      const task = Object.values(state.tasks.entities).find((t) => t?.id === taskId);

      if (task?.special_id) {
        store.dispatch(deleteTask(task.special_id));
      } else {
        console.warn(`❗️ Task with id=${taskId} not found in store`);
      }
    } catch (error) {
      const appError = handleApiError(error, 'taskService.deleteTask');
      console.error(appError.message);
      throw appError;
    }
  },

  async updateTaskStatus(taskId: number, isDone: boolean): Promise<void> {
    try {
      const response = await api.patch<TaskResponse>(`${url}/is_done/${taskId}`, {
        is_done: isDone,
      });

      if (response.data.task) {
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
      throw appError;
    }
  },

  async updateTask(taskId: number, taskData: Partial<Task>): Promise<void> {
    try {
      const response = await api.patch<Task>(`${url}/${taskId}`, taskData);

      store.dispatch(
        updateOneTask({
          id: response.data.special_id,
          changes: response.data,
        })
      );
    } catch (error) {
      const appError = handleApiError(error, 'taskService.updateTask');
      console.error(appError.message);
      throw appError;
    }
  },

  async updateSubtaskStatus(subtaskId: number, isDone: boolean): Promise<void> {
    try {
      const response = await api.patch<TaskResponse>(`${url}/subtasks/${subtaskId}`, {
        is_done: isDone,
      });

      if (response.data.task) {
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
      throw appError;
    }
  },
};
