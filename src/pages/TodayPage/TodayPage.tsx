import { selectAllTasks } from '../../entities/task/store/tasksSlice';
import { useAppSelector } from '../../hooks/storeHooks';
import { TaskSection } from '../../modules/TaskSection/TaskSection';
import { TaskFilter } from '../../utils/filer';

export const TodayPage = () => {
  // Получаем сегодняшнюю дату в формате YYYY-MM-DD
  const today = new Date().toLocaleDateString('sv-SE');

  // Получаем все задачи из стора
  const tasksMap = useAppSelector(selectAllTasks);

  // Преобразуем объект задач в массив и получаем ID задач на сегодня
  const tasks = Object.values(tasksMap);
  const todayTaskIds = TaskFilter.filterByDateGetIds(tasks, today);

  return <TaskSection date={today} taskIds={todayTaskIds} />;
};

TodayPage.displayName = 'TodayPage';
