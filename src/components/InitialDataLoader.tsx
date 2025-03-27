import { useEffect } from 'react';
import { useAppDispatch } from '../hooks/storeHooks'; // или откуда ты экспортируешь
import { fetchTasks } from '../features/tasks/tasksThunks';

export const InitialDataLoader = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  return null;
};
