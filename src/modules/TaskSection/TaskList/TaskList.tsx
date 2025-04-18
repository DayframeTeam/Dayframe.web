import { useTranslation } from 'react-i18next';
import styles from './TaskList.module.scss';
import { memo } from 'react';
import { SortedTaskItem } from './SortedTaskItem';

type Props = Readonly<{
  taskIds: string[];
}>;

export const TaskList = memo(({ taskIds }: Props) => {
  const { t } = useTranslation();

  if (taskIds.length === 0) {
    return <p style={{ color: 'var(--text-muted)' }}>{t('taskSection.empty')}</p>;
  }

  console.log('TaskList');
  return (
    <div className={styles.taskListWrapper}>
      <ul className={styles.taskList}>
        {taskIds.map((taskId) => (
          <SortedTaskItem key={taskId} taskId={taskId} />
        ))}
      </ul>
    </div>
  );
});

TaskList.displayName = 'TaskList';
