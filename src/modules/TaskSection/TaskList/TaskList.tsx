import { useTranslation } from 'react-i18next';
import styles from './TaskList.module.scss';
import { memo } from 'react';
import { SortedTaskItem } from './SortedTaskItem';

type Props = Readonly<{
  taskIds: string[];
}>;

export const TaskList = memo(({ taskIds }: Props) => {
  const { t } = useTranslation();
  console.log('TaskList');

  // Проверка пустого списка
  if (taskIds.length === 0) {
    return <p style={{ color: 'var(--text-muted)' }}>{t('taskSection.empty')}</p>;
  }

  // Используем ID задач, уже отсортированные в адаптере
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
