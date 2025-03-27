import { useTranslation } from 'react-i18next';
import { Task } from '../../types/dbTypes';
import TaskItem from '../TaskItem/TaskItem';

type Props = Readonly<{
  tasks: Task[];
}>;

export default function TaskList({ tasks }: Props) {
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
    <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: 0 }}>
      {sortedTasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}
