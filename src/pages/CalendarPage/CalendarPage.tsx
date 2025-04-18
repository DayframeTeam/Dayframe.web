import React from 'react';
import { Calendar } from '../../modules/Calendar/Calendar';
import { selectAllTasks } from '../../entities/task/store/tasksSlice';
import { useAppSelector } from '../../hooks/storeHooks';

export const CalendarPage: React.FC = React.memo(() => {
  const tasks = useAppSelector(selectAllTasks);

  return <Calendar tasks={tasks} />;
});

CalendarPage.displayName = 'CalendarPage';
