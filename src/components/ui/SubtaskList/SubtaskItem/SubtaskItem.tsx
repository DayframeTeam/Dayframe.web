import { Subtask } from '../../../../types/dbTypes';
import { Checkbox } from '../../Checkbox/Checkbox';
import styles from './SubtaskList.module.scss';
import clsx from 'clsx';

type Props = Readonly<{
  subtask: Subtask;
  onStatusUpdate: (subtaskId: string, newStatus: boolean) => void;
}>;

export function SubtaskItem({ subtask, onStatusUpdate }: Props) {
  return (
    <li className={clsx(styles.item, subtask.is_done && styles.doneLi)}>
      <label
        className={clsx(styles.labelWrapper, subtask.is_done && styles.done)}
        onClick={() => onStatusUpdate(subtask.special_id, !subtask.is_done)}
      >
        <Checkbox id={`subtask-${subtask.id}`} checked={subtask.is_done} />
        <div className={styles.title}>{subtask.title}</div>
      </label>
    </li>
  );
}
