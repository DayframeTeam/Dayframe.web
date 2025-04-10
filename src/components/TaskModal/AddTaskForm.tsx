import { memo, Dispatch, SetStateAction } from 'react';
import styles from './AddTaskModal.module.scss';
import { TaskLocal } from './types';

type AddTaskFormProps = {
  onTaskChange: Dispatch<SetStateAction<TaskLocal>>;
};

export const AddTaskForm = memo(({ onTaskChange }: AddTaskFormProps) => {
  return <div className={styles.wrapper}></div>;
});

AddTaskForm.displayName = 'AddTaskForm';
