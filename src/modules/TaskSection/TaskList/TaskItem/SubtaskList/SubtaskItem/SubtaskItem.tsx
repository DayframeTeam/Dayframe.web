import { Subtask } from '../../../../../../types/dbTypes';
import { Checkbox } from '../../../../../../shared/UI/Checkbox/Checkbox';
import styles from './SubtaskItem.module.scss';
import clsx from 'clsx';
import { memo, useState } from 'react';
import { taskService } from '../../../../../../entities/task/taskService';

type Props = Readonly<{
  subtask: Subtask;
}>;

export const SubtaskItem = memo(({ subtask }: Props) => {
  const [isUpdating, setIsUpdating] = useState(false);

  // Обработчик для чекбокса
  const handleCheckboxChange = () => {
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      taskService.updateSubtaskStatus(subtask.id, !subtask.is_done);
    } catch (error) {
      console.error('Ошибка при обновлении статуса подзадачи:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <li className={clsx(styles.item, subtask.is_done && styles.doneLi)}>
      <label
        className={clsx(styles.labelWrapper, subtask.is_done && styles.done)}
        htmlFor={`subtask-${subtask.id}`}
        style={{ pointerEvents: isUpdating ? 'none' : undefined }}
      >
        <Checkbox
          onChange={handleCheckboxChange}
          id={`subtask-${subtask.id}`}
          checked={subtask.is_done}
          disabled={isUpdating}
        />
        <div className={styles.title}>{subtask.title}</div>
      </label>
    </li>
  );
});

SubtaskItem.displayName = 'SubtaskItem';
