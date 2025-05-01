import { TaskSection } from '../../modules/TaskSection/TaskSection';

export const TodayPage = () => {
  // Получаем сегодняшнюю дату в формате YYYY-MM-DD
  const today = new Date().toLocaleDateString('sv-SE');

  return <TaskSection date={today} />;
};

TodayPage.displayName = 'TodayPage';
