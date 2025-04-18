import { useAppSelector } from '../../hooks/storeHooks';
import { TaskSection } from '../../modules/TaskSection/TaskSection';
import { selectTaskIdsByDateIncludingUndated } from '../../entities/task/store/tasksSlice';

export const TodayPage = () => {
  // Получаем сегодняшнюю дату в формате YYYY-MM-DD
  const today = new Date().toLocaleDateString('sv-SE');

  // Получаем ID задач на сегодня через селектор
  const todayTaskIds = useAppSelector((state) => selectTaskIdsByDateIncludingUndated(state, today));
  return <TaskSection date={today} taskIds={todayTaskIds} />;
};

TodayPage.displayName = 'TodayPage';
