import { TemplateTask } from '../../types/dbTypes';
import api from '../../api/http/axios';
import { handleApiError } from '../../shared/errors';
import { store } from '../../store';
import {
  addTemplateTask,
  deleteTemplateTask,
  setError,
  setLoading,
  setTemplateTasks,
  updateOneTemplateTask,
} from './store/templateTasksSlice';
import { TemplateTaskUtils } from './template.tasks.utils';

const url = '/templateTasks';

export type TemplateTasksService = {
  fetchAndStoreAll: () => Promise<void>;
  createTemplateTask: (taskData: Partial<TemplateTask>) => Promise<TemplateTask>;
  deleteTemplateTask: (taskId: number) => Promise<void>;
  updateTemplateTask: (taskId: number, taskData: Partial<TemplateTask>) => Promise<TemplateTask>;
  toggleActiveTemplateTask: (taskId: number, is_active: boolean) => Promise<TemplateTask>;
};

interface TemplateTaskResponse {
  task?: TemplateTask;
}

export const templateTasksService: TemplateTasksService = {
  async fetchAndStoreAll(): Promise<void> {
    try {
      const response = await api.get<TemplateTask[]>(url);
      store.dispatch(setTemplateTasks(response.data));
    } catch (error) {
      const appError = handleApiError(error, 'taskService.fetchAndStoreAll');
      console.error(appError.message);
      throw appError;
    }
  },

  async createTemplateTask(taskData: Partial<TemplateTask>): Promise<TemplateTask> {
    store.dispatch(setLoading(true));

    try {
      const response = await api.post<TemplateTask>(url, taskData);
      const createdTask = response.data;

      // Точечное обновление - добавляем только одну задачу
      store.dispatch(addTemplateTask(createdTask));

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

  async deleteTemplateTask(taskId: number): Promise<void> {
    store.dispatch(setLoading(true));

    try {
      await api.delete(`${url}/${taskId}`);
      // Создаем уникальный ключ для задачи
      const taskKey = TemplateTaskUtils.createTemplateTaskUniqueKey({ id: taskId } as TemplateTask);
      // Удаляем задачу по новому ключу
      store.dispatch(deleteTemplateTask(taskKey));
    } catch (error) {
      const appError = handleApiError(error, 'taskService.deleteTask');
      console.error(appError.message);
      store.dispatch(setError(appError.message));
      throw appError;
    } finally {
      store.dispatch(setLoading(false));
    }
  },

  async updateTemplateTask(taskId: number, taskData: Partial<TemplateTask>): Promise<TemplateTask> {
    store.dispatch(setLoading(true));

    try {
      // Отправляем запрос на сервер
      const response = await api.patch<TemplateTaskResponse>(`${url}/${taskId}`, taskData);

      // Бэкенд всегда должен возвращать обновленную задачу
      if (response.data.task) {
        // Обновляем задачу в Redux store
        store.dispatch(
            updateOneTemplateTask({
            id: TemplateTaskUtils.createTemplateTaskUniqueKey({ id: response.data.task.id } as TemplateTask),
            changes: response.data.task,
          })
        );

        return response.data.task;
      }

      // Если задача не вернулась, это ошибка
      throw new Error('Server did not return the updated task');
    } catch (error) {
      const appError = handleApiError(error, 'taskService.updateTask');
      console.error(appError.message);
      store.dispatch(setError(appError.message));
      throw appError;
    } finally {
      store.dispatch(setLoading(false));
    }
  },

  async toggleActiveTemplateTask(taskId: number, is_active: boolean): Promise<TemplateTask> {
    store.dispatch(setLoading(true));

    try {
      // Отправляем запрос на сервер
      const response = await api.patch<TemplateTaskResponse>(`${url}/${taskId}/set_active`, { is_active: is_active });

      // Бэкенд всегда должен возвращать обновленную задачу
      if (response.data.task) {
        // Обновляем задачу в Redux store
        store.dispatch(
          updateOneTemplateTask({
            id: TemplateTaskUtils.createTemplateTaskUniqueKey({ id: response.data.task.id } as TemplateTask),
            changes: response.data.task,
          })
        );
        return response.data.task;
      }

      // Если задача не вернулась, это ошибка
      throw new Error('Server did not return the updated task');
    } catch (error) {
      const appError = handleApiError(error, 'taskService.updateTask');
      console.error(appError.message);
      store.dispatch(setError(appError.message));
      throw appError;
    } finally {
      store.dispatch(setLoading(false));
    }
  },
};
