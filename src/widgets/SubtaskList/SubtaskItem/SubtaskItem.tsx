import { Subtask } from '../../../types/dbTypes';
import { Checkbox } from '../../../shared/UI/Checkbox/Checkbox';
import styles from './SubtaskList.module.scss';
import clsx from 'clsx';
import { memo, useState } from 'react';
import { taskService } from '../../../entities/task/taskService';

type Props = Readonly<{
  subtask: Subtask;
}>;

export const SubtaskItem = memo(({ subtask }: Props) => {
  // локальный стейт, чтобы блокировать повторные клики
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubtaskStatusUpdate = async () => {
    // если запрос уже в полёте — ничего не делаем
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      await taskService.updateSubtaskStatus(subtask.id, !subtask.is_done);
      console.log('handleSubtaskStatusUpdate', subtask.id, !subtask.is_done);
    } catch (error) {
      console.error('Error updating subtask status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <li className={clsx(styles.item, subtask.is_done && styles.doneLi)}>
      <label
        className={clsx(styles.labelWrapper, subtask.is_done && styles.done)}
        // если идёт запрос — блокируем дальнейшие клики
        onClick={handleSubtaskStatusUpdate}
        style={{ pointerEvents: isUpdating ? 'none' : undefined }}
      >
        <Checkbox id={`subtask-${subtask.id}`} checked={subtask.is_done} disabled={isUpdating} />
        <div className={styles.title}>{subtask.title}</div>
      </label>
    </li>
  );
});

SubtaskItem.displayName = 'SubtaskItem';
