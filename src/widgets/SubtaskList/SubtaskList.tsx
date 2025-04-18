import styles from './SubtaskList.module.scss';
import { Subtask, Task } from '../../types/dbTypes';
import { SubtaskItem } from './SubtaskItem/SubtaskItem';
import { memo } from 'react';

type Props = Readonly<{
  task: Task;
}>;

export const SubtaskList = memo(({ task }: Props) => {
  console.log('SubtaskList');

  return (
    <div className={styles.wrapper}>
      <ul className={styles.list}>
        {task.subtasks.map((subtask: Subtask) => (
          <SubtaskItem key={subtask.special_id} subtask={subtask} />
        ))}
      </ul>
    </div>
  );
});

SubtaskList.displayName = 'SubtaskList';
