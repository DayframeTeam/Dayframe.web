import { useTranslation } from 'react-i18next';
import { Modal } from '../../../shared/Modal/Modal';
import { DayTask, Task, TemplateTask } from '../../../types/dbTypes';
import { memo } from 'react';
import { GeneralForm } from '../../../shared/GeneralForm/GeneralForm';
import { taskService } from '../../../entities/task/taskService';
import { TaskUtils } from '../../../entities/task/tasks.utils';

type Props = Readonly<{
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
  task_date?: string;
}>;

export const TaskModal = memo(({ isOpen, onClose, task, task_date }: Props) => {
  const { t } = useTranslation();
  const isEdit = !!task;
  let taskCopy: Task | undefined;
  let handleSubmit = undefined;
  const handleDelete = async (e: React.FormEvent, task: Task | TemplateTask | DayTask) => {
    e.preventDefault();
    try {
      await taskService.deleteTask(task.id);
      onClose(); // Закрываем модальное окно после успешного создания
    } catch (error) {
      console.error('Ошибка при удалении:', error);
    }
  };

  if (isEdit) {
    taskCopy = {
      ...task,
      exp: undefined,
    };

    handleSubmit = async (e: React.FormEvent, task: Task | TemplateTask | DayTask) => {
      e.preventDefault();
      try {
        await taskService.updateTask(task.id, task as Partial<Task>);
        onClose(); // Закрываем модальное окно после успешного создания
      } catch (error) {
        console.error('Ошибка при редактировании:', error);
      }
    };
  } else {
    taskCopy = TaskUtils.createEmptyTask(task_date);

    handleSubmit = async (e: React.FormEvent, task: Task | TemplateTask | DayTask) => {
      e.preventDefault();
      try {
        await taskService.createTask(task as Partial<Task>);
        onClose(); // Закрываем модальное окно после успешного создания
      } catch (error) {
        console.error('Ошибка при создании задачи:', error);
      }
    };
  }

  return (
    isOpen && (
      <Modal onClose={onClose} title={isEdit ? t('task.edit') : t('task.add')}>
        <GeneralForm
          task={taskCopy}
          isEdit={isEdit}
          handleSubmit={handleSubmit}
          handleDelete={handleDelete}
        />
      </Modal>
    )
  );
});

TaskModal.displayName = 'TaskModal';
