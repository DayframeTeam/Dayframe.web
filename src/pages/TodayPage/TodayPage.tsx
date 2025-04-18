import { useAppSelector } from '../../hooks/storeHooks';
import { TaskSection } from '../../modules/TaskSection/TaskSection';
import {
  selectTasksLoading,
  selectTasksError,
  selectTaskIdsByDateIncludingUndated,
} from '../../entities/task/store/tasksSlice';
import React from 'react';

export const TodayPage: React.FC = React.memo(() => {
  // Получаем сегодняшнюю дату в формате YYYY-MM-DD
  const today = new Date().toLocaleDateString('sv-SE');

  // Получаем ID задач на сегодня через селектор
  const todayTaskIds = useAppSelector((state) => selectTaskIdsByDateIncludingUndated(state, today));

  // Получаем статус загрузки и ошибки из Redux
  const isLoading = useAppSelector(selectTasksLoading);
  const error = useAppSelector(selectTasksError);

  // Отображаем секцию задач, передавая идентификаторы задач
  return (
    <>
      {isLoading && <div>Загрузка задач...</div>}
      {error && <div>Ошибка: {error}</div>}
      <TaskSection date={today} taskIds={todayTaskIds} />
    </>
  );
});

TodayPage.displayName = 'TodayPage';
