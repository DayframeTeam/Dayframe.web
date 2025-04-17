import styles from './SubtaskList.module.scss';
import { Subtask, Task } from '../../../types/dbTypes';
import { SubtaskItem } from './SubtaskItem/SubtaskItem';

type Props = Readonly<{
  task: Task;
}>;

export function SubtaskList({ task }: Props) {
  console.log('SubtaskList');
  const handleSubtaskStatusUpdate = (subtaskId: string, newStatus: boolean) => {
    console.log('handleSubtaskStatusUpdate', subtaskId, newStatus);
  }

  return (
    <div className={styles.wrapper}>
      <ul className={styles.list}>
        {task.subtasks.map((subtask: Subtask) => (
          <SubtaskItem key={subtask.special_id} subtask={subtask} onStatusUpdate={() => handleSubtaskStatusUpdate(subtask.special_id, !subtask.is_done)} />
        ))}
      </ul>
    </div>
  );
}
