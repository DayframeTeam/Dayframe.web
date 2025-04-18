import { useAppSelector } from '../../hooks/storeHooks';
import { TaskSection } from '../../modules/TaskSection/TaskSection';
import { selectTaskIdsByDate } from '../../entities/task/store/tasksSlice';
import React from 'react';

export const TodayPage: React.FC = React.memo(() => {
  const today = new Date().toLocaleDateString('sv-SE');

  // Используем мемоизированный селектор для получения только ID задач
  const todayTaskIds = useAppSelector((state) => selectTaskIdsByDate(state, today));

  // Передаем только ID задач в TaskSection
  return <TaskSection date={today} taskIds={todayTaskIds} />;
});

TodayPage.displayName = 'TodayPage';
