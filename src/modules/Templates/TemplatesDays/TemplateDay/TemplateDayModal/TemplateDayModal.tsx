import { useTranslation } from 'react-i18next';
import { Modal } from '../../../shared/Modal/Modal';
import { DayTask, RepeatRule, Task, TemplateTask } from '../../../types/dbTypes';
import { memo } from 'react';
import { GeneralForm } from '../../../shared/GeneralForm/GeneralForm';
import { TemplateTaskUtils } from '../../../entities/template-tasks/template.tasks.utils';

type Props = Readonly<{
  isOpen: boolean;
  onClose: () => void;
  dayTasks?: DayTask[];
}>;

export const TemplateDayModal = memo(({ isOpen, onClose, day }: Props) => {
  const { t } = useTranslation();
  const isEdit = !!day;
  let dayCopy: Day | undefined;
  let handleSubmit = undefined;
  const handleDelete = (e: React.FormEvent, task: Task | TemplateTask | DayTask) => {
    e.preventDefault();
    console.log('Я удаляю ', task);
  };

  if (isEdit) {
    taskCopy = {
      ...task,
      exp: undefined,
    };

    handleSubmit = (e: React.FormEvent, task: Task | TemplateTask | DayTask) => {
      e.preventDefault();
      console.log('Я редактирую ', task);
    };
  } else {
    taskCopy = TemplateTaskUtils.createEmptyTemplateTask(repeat_rule);

    handleSubmit = (e: React.FormEvent, task: Task | TemplateTask | DayTask) => {
      e.preventDefault();
      console.log('Я создаю ', task);
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

TemplateDayModal.displayName = 'TemplateDayModal';
