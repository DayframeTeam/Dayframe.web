import { useTranslation } from 'react-i18next';
import { Modal } from '../../../shared/Modal/Modal';
import { DayTask, RepeatRule, Task, TemplateTask } from '../../../types/dbTypes';
import { memo } from 'react';
import { GeneralForm } from '../../../shared/GeneralForm/GeneralForm';
import { TemplateTaskUtils } from '../../../entities/template-tasks/template.tasks.utils';
import { templateTasksService } from '../../../entities/template-tasks/templateTasksService';

type Props = Readonly<{
  isOpen: boolean;
  onClose: () => void;
  task?: TemplateTask;
  repeat_rule?: RepeatRule;
}>;

export const TemplateTaskModal = memo(({ isOpen, onClose, task, repeat_rule }: Props) => {
  const { t } = useTranslation();
  const isEdit = !!task;
  let taskCopy: TemplateTask | undefined;
  let handleSubmit = undefined;
  const handleDelete = async (e: React.FormEvent, task: Task | TemplateTask | DayTask) => {
    e.preventDefault();
    try {
      await templateTasksService.deleteTemplateTask(task.id);
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
        await templateTasksService.updateTemplateTask(task.id, task as Partial<TemplateTask>);
        onClose(); // Закрываем модальное окно после успешного создания
      } catch (error) {
        console.error('Ошибка при редактировании:', error);
      }
    };
  } else {
    taskCopy = TemplateTaskUtils.createEmptyTemplateTask(repeat_rule);

    handleSubmit = async (e: React.FormEvent, task: Task | TemplateTask | DayTask) => {
      e.preventDefault();
      try {
        await templateTasksService.createTemplateTask(task as Partial<TemplateTask>);
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

TemplateTaskModal.displayName = 'TemplateTaskModal';
