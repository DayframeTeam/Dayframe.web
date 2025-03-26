import { useEffect } from 'react';
import { useAppDispatch } from '../hooks/storeHooks'; // или откуда ты экспортируешь
import { fetchTasks } from '../features/tasks/tasksThunks';
import { fetchTemplateTasks } from '../features/templateTasks/templateTasksThunks';

export const InitialDataLoader = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchTemplateTasks());
  }, [dispatch]);

  return null;
};
