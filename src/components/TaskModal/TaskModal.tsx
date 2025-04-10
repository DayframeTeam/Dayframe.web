import { useTranslation } from 'react-i18next';
import { Modal } from '../../components/Modal/Modal';
import { Task } from '../../types/dbTypes';
import { EditTaskForm } from './Forms/EditTaskForm';
import { AddTaskForm } from './Forms/AddTaskForm';
import { memo } from 'react';

type Props = Readonly<{
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
  date?: string; // в формате 'YYYY-MM-DD'
}>;

export const TaskModal = memo(({ isOpen, onClose, task, date }: Props) => {
  const { t } = useTranslation();
  const isEdit = !!task;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? t('task.edit') : t('task.add')}>
      {isEdit ? <EditTaskForm task={task} /> : <AddTaskForm date={date} />}
    </Modal>
  );
});

TaskModal.displayName = 'TaskModal';
