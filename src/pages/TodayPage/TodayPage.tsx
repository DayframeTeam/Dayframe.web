import { useAppSelector } from '../../hooks/storeHooks';
import { Task } from '../../types/dbTypes';
import { toLocalDateString } from '../../utils/dateUtils';
import TaskSection from '../../components/TaskSection/TaskSection';

export default function TodayPage() {
  const tasks = useAppSelector((state) => state.tasks);
  const today = new Date().toLocaleDateString('sv-SE');
  const todayTasks: Task[] = tasks.filter(
    (task) => !task.task_date || toLocalDateString(task.task_date) === today
  );

  return (
    <div style={{ padding: '2rem' }}>
      <TaskSection date={today} tasks={todayTasks} />
    </div>
  );
}
