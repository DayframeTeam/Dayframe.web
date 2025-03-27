import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../store';
import { Subtask } from '../../../../types/dbTypes';
import { Checkbox } from '../../Checkbox/Checkbox';
import { updateSubtaskStatus } from '../../../../features/subtasks/subtasksThunks';
import styles from './SubtaskList.module.scss';
import clsx from 'clsx';

type Props = Readonly<{
  subtask: Subtask;
}>;

function SubtaskItem({ subtask }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleStatus = () => {
    if (isUpdating) return;
    setIsUpdating(true);
    dispatch(updateSubtaskStatus({ id: subtask.id, is_done: !subtask.is_done })).finally(() =>
      setIsUpdating(false)
    );
  };

  return (
    <li className={clsx(styles.item, subtask.is_done && styles.doneLi)}>
      <label
        className={clsx(styles.labelWrapper, subtask.is_done && styles.done)}
        onClick={(e) => {
          e.stopPropagation();
          toggleStatus();
        }}
      >
        <Checkbox id={`subtask-${subtask.id}`} checked={subtask.is_done} disabled={isUpdating} />
        <div className={styles.title}>{subtask.title}</div>
      </label>
    </li>
  );
}

export default SubtaskItem;
