import { Task } from '../../types/dbTypes';
import api from '../../api/http/axios';
import { store } from '../../store';
import { handleApiError } from '../../shared/errors';
import { addTask, deleteTask, setTasks, updateTask } from './store/tasksSlice';
import { setUserExp } from '../user/store/userSlice';
import { TaskFind } from '../../utils/find';

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
    try {
      const response = await api.get<Task[]>(url);
      // Сохраняем все задачи в store
      store.dispatch(setTasks(response.data));
    } catch (error) {
      const appError = handleApiError(error, 'taskService.fetchAndStoreAll');
      console.error(appError.message);
      throw appError;
    }
  },

  /**
   * Creates a new task and updates Redux store
   * @param taskData - Partial task data
   * @returns Created task
   */
  async createTask(taskData: Partial<Task>): Promise<Task> {
    try {
      const response = await api.post<Task>(url, taskData);
      const createdTask = response.data;

      // Точечное обновление - добавляем только одну задачу
      store.dispatch(addTask(createdTask));

      return createdTask;
    } catch (error) {
      const appError = handleApiError(error, 'taskService.createTask');
      console.error(appError.message);
      throw appError;
    }
  },

  /**
   * Deletes a task by ID and updates Redux store
   * @param taskId - Task ID
   */
  async deleteTask(taskId: number): Promise<void> {
    try {
      await api.delete(`${url}/${taskId}`);

      // Находим задачу по ID для получения special_id
      const state = store.getState();
      const tasks = Object.values(state.tasks);
      const task = TaskFind.findTaskById(tasks, taskId);

      if (task?.special_id) {
        // Точечное обновление - удаляем только одну задачу по special_id
        store.dispatch(deleteTask(task.special_id));
      }
    } catch (error) {
      const appError = handleApiError(error, 'taskService.deleteTask');
      console.error(appError.message);
      throw appError;
    }
  },

  /**
   * Updates task status and handles XP changes
   * @param taskId - Task ID
   * @param isDone - New status
   */
  async updateTaskStatus(taskId: number, isDone: boolean): Promise<void> {
    try {
      const response = await api.patch<TaskResponse>(`${url}/is_done/${taskId}`, {
        is_done: isDone,
      });

      if (response.data.task) {
        // Точечное обновление - обновляем только одну задачу
        store.dispatch(updateTask(response.data.task));
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

  /**
   * Updates task properties and manages its subtasks
   * @param taskId - Task ID
   * @param taskData - Updated task data
   * @returns Updated task
   */
  async updateTask(taskId: number, taskData: Partial<Task>): Promise<Task> {
    try {
      // Отправляем запрос на сервер
      const response = await api.patch<TaskResponse>(`${url}/${taskId}`, taskData);

      // Бэкенд всегда должен возвращать обновленную задачу
      if (response.data.task) {
        // Обновляем задачу в Redux store
        store.dispatch(updateTask(response.data.task));

        // Если изменился опыт пользователя, обновляем его в store
        if (response.data.userExp !== undefined) {
          store.dispatch(setUserExp(response.data.userExp));
        }

        return response.data.task;
      }

      // Если задача не вернулась, это ошибка
      throw new Error('Server did not return the updated task');
    } catch (error) {
      const appError = handleApiError(error, 'taskService.updateTask');
      console.error(appError.message);
      throw appError;
    }
  },

  /**
   * Updates subtask status
   * @param subtaskId - Subtask ID
   * @param isDone - New status
   */
  async updateSubtaskStatus(subtaskId: number, isDone: boolean): Promise<void> {
    try {
      const response = await api.patch<TaskResponse>(`${url}/subtasks/${subtaskId}`, {
        is_done: isDone,
      });

      if (response.data.task) {
        // Точечное обновление - обновляем только родительскую задачу
        store.dispatch(updateTask(response.data.task));
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
