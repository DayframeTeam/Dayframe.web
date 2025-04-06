import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/storeHooks';
import { fetchTasks } from '../features/tasks/tasksThunks';
import { fetchUser } from '../features/user/userThunks';
import { useTranslation } from 'react-i18next';

export const InitialDataLoader = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { isLoading: tasksLoading, error: tasksError } = useAppSelector((state) => state.tasks);
  const { isLoading: userLoading, error: userError } = useAppSelector((state) => state.user);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchUser());
  }, [dispatch]);

  if (tasksLoading || userLoading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>{t('loading')}</div>;
  }

  if (tasksError || userError) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>{t('error.loading')}</div>
    );
  }

  return <>{children}</>;
};
