import styles from './SubtaskList.module.scss';
import { Subtask } from '../../../../../types/dbTypes';
import { SubtaskItem } from './SubtaskItem/SubtaskItem';
import { memo, useMemo } from 'react';

type Props = Readonly<{
  subtasks: Subtask[];
}>;

export const SubtaskList = memo(({ subtasks }: Props) => {
  console.log('SubtaskList');

  // Сортируем подзадачи по position
  const sortedSubtasks = useMemo(() => {
    return [...subtasks].sort((a, b) => a.position - b.position);
  }, [subtasks]);

  return (
    <div className={styles.wrapper}>
      <ul className={styles.list}>
        {sortedSubtasks.map((subtask: Subtask) => (
          <SubtaskItem key={subtask.id} subtask={subtask} />
        ))}
      </ul>
    </div>
  );
});

SubtaskList.displayName = 'SubtaskList';
