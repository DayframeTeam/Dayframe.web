import { useTranslation } from 'react-i18next';
import { Modal } from '../../components/Modal/Modal';
import { DayTask, RepeatRule, Task, TemplateTask } from '../../types/dbTypes';
import { memo } from 'react';
import { nanoid } from 'nanoid';
import { TaskForm } from './TaskForm';

type Props = Readonly<{
  isOpen: boolean;
  onClose: () => void;
  type: 'Task' | 'TemplateTask' | 'DayTask';
  task?: Task | TemplateTask | DayTask;
  task_date?: string;
  repeat_rule?: RepeatRule;
  day_id?: number;
}>;

export const TaskModal = memo(
  ({ isOpen, onClose, type, task, task_date, repeat_rule, day_id }: Props) => {
    const { t } = useTranslation();
    const isEdit = !!task;
    let taskCopy: Task | TemplateTask | DayTask | undefined;
    let handleSubmit = undefined;
    let handleDelete = undefined;

    if (isEdit) {
      taskCopy = {
        ...task,
        exp: undefined,
      };

      handleSubmit = (e: React.FormEvent, task: Task | TemplateTask | DayTask) => {
        e.preventDefault();
        console.log('Я редактирую ', type, task);
      };

      handleDelete = (e: React.FormEvent, task: Task | TemplateTask | DayTask) => {
        e.preventDefault();
        console.log('Я удаляю ', type, task);
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

        handleSubmit = (e: React.FormEvent, task: Task | TemplateTask | DayTask) => {
          e.preventDefault();
          console.log('Я создаю ', type, task);
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
      <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? t('task.edit') : t('task.add')}>
        <TaskForm
          task={taskCopy}
          isEdit={isEdit}
          handleSubmit={handleSubmit}
          handleDelete={handleDelete}
        />
      </Modal>
    );
  }
);

TaskModal.displayName = 'TaskModal';
