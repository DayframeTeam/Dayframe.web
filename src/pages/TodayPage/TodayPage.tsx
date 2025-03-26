import { useAppSelector } from '../../hooks/storeHooks';
import { Task } from '../../types/dbTypes';
import TaskList from '../../components/TaskList/TaskList'; // Компонента для отображения задач (все задачи на сегодня)

export default function TodayPage() {
  const tasks = useAppSelector((state) => state.tasks);

  // Фильтруем задачи для сегодняшнего дня или без даты
  const today = new Date().toISOString().split('T')[0]; // формат YYYY-MM-DD
  const todayTasks: Task[] = tasks.filter((task) => !task.task_date || task.task_date === today);

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Задачи на сегодня</h2>
      <TaskList tasks={todayTasks} />
    </div>
  );
}
