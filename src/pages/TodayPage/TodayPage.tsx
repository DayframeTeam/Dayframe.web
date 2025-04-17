import { useAppSelector } from '../../hooks/storeHooks';
import { TaskSection } from '../../components/TaskSection/TaskSection';
import { toLocalDateString } from '../../utils/dateUtils';
import { selectAllTasks } from '../../entities/task/store/tasksSlice';
import React from 'react';

export const TodayPage: React.FC = React.memo(() => {
  const today = new Date().toLocaleDateString('sv-SE');

  // Получаем все задачи через адаптер
  const allTasks = useAppSelector(selectAllTasks);

  // Фильтруем только задачи на сегодня
  const todayTasks = allTasks.filter(
    (task) => !task.task_date || toLocalDateString(task.task_date) === today
  );

  return <TaskSection date={today} taskIds={todayTasks.map((task) => task.special_id)} />;
});

TodayPage.displayName = 'TodayPage';
