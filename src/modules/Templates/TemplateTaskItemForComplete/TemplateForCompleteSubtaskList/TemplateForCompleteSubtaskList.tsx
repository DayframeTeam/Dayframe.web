import { Subtask, Task } from '../../../../types/dbTypes';
import styles from '../../../TaskSection/TaskList/TaskItem/SubtaskList/SubtaskList.module.scss';
import { memo, useMemo } from 'react';
import { TemplateForCompleteSubtaskItem } from './TemplateForCompleteSubtaskItem';

type Props = Readonly<{
  task: Task;
  subtasks: Subtask[];
}>;

export const TemplateForCompleteSubtaskList = memo(({ task, subtasks }: Props) => {
  // Сортируем подзадачи по position
  const sortedSubtasks = useMemo(() => {
    return [...subtasks].sort((a, b) => a.position - b.position);
  }, [subtasks]);

  return (
    <div className={styles.wrapper}>
      <ul className={styles.list}>
        {sortedSubtasks.map((subtask: Subtask) => (
          <TemplateForCompleteSubtaskItem key={subtask.id} task={task} subtask={subtask} />
        ))}
      </ul>
    </div>
  );
});

TemplateForCompleteSubtaskList.displayName = 'TemplateForCompleteSubtaskList';
