import { useRef } from 'react';
import { useAppDispatch } from '../hooks/storeHooks';
import { fetchTasks } from '../features/tasks/tasksThunks';
import { fetchUser } from '../features/user/userThunks';

export const InitialDataLoader = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const hasLoaded = useRef(false);

  if (!hasLoaded.current) {
    hasLoaded.current = true;
    dispatch(fetchUser()).then(() => dispatch(fetchTasks()));
  }

  return <>{children}</>;
};
