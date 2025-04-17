import { useTranslation } from 'react-i18next';
import { Modal } from '../../components/Modal/Modal';
import { DayTask, RepeatRule, Task, TemplateTask } from '../../types/dbTypes';
import { memo } from 'react';
import { nanoid } from 'nanoid';
import { TaskForm } from './TaskForm';
import { TaskService, taskService } from '../../entities/task/taskService';

type Props = Readonly<{
  isOpen: boolean;
  onClose: () => void;
  type: 'Task' | 'TemplateTask' | 'DayTask';
  task?: Task | TemplateTask | DayTask;
  task_date?: string;
  repeat_rule?: RepeatRule;
  day_id?: number;
}>;

type AnyService = TaskService;

export const TaskModal = memo(
  ({ isOpen, onClose, type, task, task_date, repeat_rule, day_id }: Props) => {
    const { t } = useTranslation();
    const isEdit = !!task;
    let taskCopy: Task | TemplateTask | DayTask | undefined;
    let handleSubmit = undefined;
    let handleDelete = undefined;

    // Функция для получения соответствующего сервиса для типа задачи
    const getTaskService = (task: Task | TemplateTask | DayTask): AnyService => {
      if ('is_done' in task && 'task_date' in task) {
        // Для обычных задач
        return taskService;
      }
      // else if ('is_active' in task && 'repeat_rule' in task) {
      //   // Для шаблонных задач - пока используем тот же сервис
      //   // TODO: реализовать отдельный сервис для шаблонов
      //   return taskService;
      // } else if ('day_id' in task) {
      //   // Для дневных задач - пока используем тот же сервис
      //   // TODO: реализовать отдельный сервис для дневных задач
      //   return taskService;
      // }
      // // По умолчанию возвращаем основной сервис задач
      // return taskService;
      return taskService;
    };

    if (isEdit) {
      taskCopy = {
        ...task,
        exp: undefined,
      };

      handleSubmit = async (e: React.FormEvent, task: Task | TemplateTask | DayTask) => {
        e.preventDefault();
        try {
          await getTaskService(task).updateTask(task.id, task as Partial<Task>);
          onClose(); // Закрываем модальное окно после успешного создания
        } catch (error) {
          console.error('Ошибка при редактировании:', error);
        }
      };

      handleDelete = async (e: React.FormEvent, task: Task | TemplateTask | DayTask) => {
        e.preventDefault();
        try {
          await getTaskService(task).deleteTask(task.id);
          onClose(); // Закрываем модальное окно после успешного создания
        } catch (error) {
          console.error('Ошибка при удалении:', error);
        }
      };
    } else {
      if (type === 'Task') {
        taskCopy = {
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
          is_done: false,
          task_date,
          subtasks: [],
        };

        handleSubmit = async (e: React.FormEvent, task: Task | TemplateTask | DayTask) => {
          e.preventDefault();
          try {
            await taskService.createTask(task as Partial<Task>);
            onClose(); // Закрываем модальное окно после успешного создания
          } catch (error) {
            console.error('Ошибка при создании задачи:', error);
          }
        };
      } else if (type === 'TemplateTask') {
        taskCopy = {
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

        handleSubmit = (e: React.FormEvent, task: Task | TemplateTask | DayTask) => {
          e.preventDefault();
          console.log('Я создаю ', type, task);
        };
      } else if (type === 'DayTask') {
        taskCopy = {
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
          day_id: day_id ?? 0,
          subtasks: [],
        };

        handleSubmit = (e: React.FormEvent, task: Task | TemplateTask | DayTask) => {
          e.preventDefault();
          console.log('Я создаю ', type, task);
        };
      }
    }

    if (!taskCopy || !handleSubmit) {
      return null;
    }

    return (
      isOpen && (
        <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? t('task.edit') : t('task.add')}>
          <TaskForm
            task={taskCopy}
            isEdit={isEdit}
            handleSubmit={handleSubmit}
            handleDelete={handleDelete}
          />
        </Modal>
      )
    );
  }
);

TaskModal.displayName = 'TaskModal';
