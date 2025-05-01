import { useTranslation } from 'react-i18next';
import styles from './TaskList.module.scss';
import { memo } from 'react';
import { SortedTaskItem } from './SortedTaskItem';
import { useAppSelector } from '../../../hooks/storeHooks';
import { CommonTaskSelectors } from '../../../entities/common/selectors';

type Props = Readonly<{
  date: string;
}>;

export const TaskList = memo(({ date }: Props) => {
  const { t } = useTranslation();

  // Получаем отсортированный список ID задач
  const taskIds = useAppSelector((state) =>
    CommonTaskSelectors.selectSortedTaskIdsForDate(state, date)
  );

  if (taskIds.length === 0) {
    return <p style={{ color: 'var(--text-muted)' }}>{t('taskSection.empty')}</p>;
  }

  return (
    <div className={styles.taskListWrapper}>
      <ul className={styles.taskList}>
        {taskIds.map((taskId) => (
          <SortedTaskItem key={taskId} taskId={taskId} date={date} />
        ))}
      </ul>
    </div>
  );
});

TaskList.displayName = 'TaskList';
