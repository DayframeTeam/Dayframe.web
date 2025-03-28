import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/storeHooks';
import { fetchTasks } from '../features/tasks/tasksThunks';

export const InitialDataLoader = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.tasks.isLoading);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  if (isLoading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Загрузка...</div>;
  }

  return <>{children}</>;
};
