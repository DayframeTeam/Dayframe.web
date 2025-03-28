import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/storeHooks';
import { fetchTasks } from '../features/tasks/tasksThunks';
import { useTranslation } from 'react-i18next';

export const InitialDataLoader = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.tasks);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  if (isLoading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>{t('loading')}</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>{t('error.loading')}</div>
    );
  }

  return <>{children}</>;
};
