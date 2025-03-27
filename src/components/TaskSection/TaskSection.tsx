import { useTranslation } from 'react-i18next';
import TaskList from '../TaskList/TaskList';
import type { Task } from '../../types/dbTypes';

type Props = Readonly<{
  date: string; // в формате 'YYYY-MM-DD'
  tasks: Task[];
}>;

export default function TaskSection({ date, tasks }: Props) {
  const { t } = useTranslation();
  const today = new Date().toLocaleDateString('sv-SE');
  const isToday = date === today;

  return (
    <section style={{ marginBottom: '2rem' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
        {isToday ? t('taskSection.today') : t('taskSection.dateTasks', { date })}
      </h2>
      <TaskList tasks={tasks} />
    </section>
  );
}
