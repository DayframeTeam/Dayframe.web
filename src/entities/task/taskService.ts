import { Task } from '../../types/dbTypes';
import api from '../../api/http/axios';
import { store } from '../../store';
import { handleApiError } from '../../shared/errors';

const url = '/tasks';

export type TaskService = {
  fetchAndStoreAll: () => Promise<Task[]>;
  createTask: (taskData: Partial<Task>) => Promise<Task>;
  deleteTask: (taskId: number) => Promise<void>;
  updateTaskStatus: (taskId: number, isDone: boolean) => Promise<Task>;
};

/**
 * Service for managing tasks with database and store integration
 */
export const taskService: TaskService = {
  /**
   * Fetch all tasks from the server and update the store
   */
  async fetchAndStoreAll(): Promise<Task[]> {
    try {
      const response = await api.get<Task[]>(url);

      // Update store
      store.dispatch({ type: 'tasks/setTasks', payload: response.data });

      return response.data;
    } catch (error) {
      // Handle error
      const appError = handleApiError(error, 'taskService.fetchAndStoreAll');
      console.error(appError.message);
      throw appError;
    }
  },

  /**
   * Create a new task and add it to the store
   */
  async createTask(taskData: Partial<Task>): Promise<Task> {
    try {
      const response = await api.post<Task>(url, taskData);

      // Add the new task to the store
      store.dispatch({ type: 'tasks/addTask', payload: response.data });

      return response.data;
    } catch (error) {
      const appError = handleApiError(error, 'taskService.createTask');
      console.error(appError.message);
      throw appError;
    }
  },

  /**
   * Delete a task and remove it from the store
   */
  async deleteTask(taskId: number): Promise<void> {
    try {
      await api.delete(`${url}/${taskId}`);

      // Remove the task from the store
      store.dispatch({ type: 'tasks/deleteTask', payload: taskId });
    } catch (error) {
      const appError = handleApiError(error, 'taskService.deleteTask');
      console.error(appError.message);
      throw appError;
    }
  },

  /**
   * Update task status (mark as done/undone)
   */
  async updateTaskStatus(taskId: number, isDone: boolean): Promise<Task> {
    try {
      const response = await api.patch<Task>(`${url}/is_done/${taskId}`, { is_done: isDone });

      // Update task in store
      store.dispatch({ type: 'tasks/updateOneTask', payload: response.data });

      return response.data;
    } catch (error) {
      const appError = handleApiError(error, 'taskService.updateTaskStatus');
      console.error(appError.message);
      throw appError;
    }
  },
};
