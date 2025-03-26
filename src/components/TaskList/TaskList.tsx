import { Task } from '../../types/dbTypes';
import TaskItem from '../TaskItem/TaskItem';

type Props = Readonly<{
  tasks: Task[];
}>;

export default function TaskList({ tasks }: Props) {
  if (tasks.length === 0) {
    return <p style={{ color: 'var(--text-muted)' }}>На сегодня задач нет</p>;
  }

  return (
    <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}
