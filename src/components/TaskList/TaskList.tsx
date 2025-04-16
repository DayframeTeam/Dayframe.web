import { useTranslation } from 'react-i18next';
import { Task } from '../../types/dbTypes';
import TaskItem from '../TaskItem/TaskItem';
import styles from './TaskList.module.scss';
import { memo } from 'react';

type Props = Readonly<{
  tasks: Task[];
}>;

export const TaskList = memo(({ tasks }: Props) => {
  const { t } = useTranslation();

  if (tasks.length === 0) {
    return <p style={{ color: 'var(--text-muted)' }}>{t('taskSection.empty')}</p>;
  }

  // Сортировка по start_time (null значения в конец)
  const sortedTasks = [...tasks].sort((a, b) => {
    if (!a.start_time && !b.start_time) return 0;
    if (!a.start_time) return 1;
    if (!b.start_time) return -1;
    return a.start_time.localeCompare(b.start_time);
  });

  return (
    // Оборачиваем список в специальный контейнер
    <div className={styles.taskListWrapper}>
      <ul className={styles.taskList}>
        {sortedTasks.map((task) => (
          <TaskItem key={task.special_id} task={task} />
        ))}
      </ul>
    </div>
  );
});
