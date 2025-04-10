import { useTranslation } from 'react-i18next';
import { Modal } from '../../components/Modal/Modal';
import { Task } from '../../types/dbTypes';
import { EditTaskForm } from './EditTaskForm';
// import { AddTaskForm } from './AddTaskForm';

type Props = Readonly<{
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
}>;

export default function TaskModal({ isOpen, onClose, task }: Props) {
  const { t } = useTranslation();
  const isEdit = !!task;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? t('task.edit') : t('task.create')}>
      {isEdit ? <EditTaskForm task={task} /> : <div>AddTaskForm</div>}
    </Modal>
  );
}
