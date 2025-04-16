import { useState, useEffect } from 'react';
import { userService } from '../entities/user/userService';
import { taskService } from '../entities/task/taskService';

export const InitialDataLoader = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    userService
      .fetchAndStoreCurrentUser()
      .then(() => taskService.fetchAndStoreAll())
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div>Загрузка данных...</div>;
  }

  return <>{children}</>;
};
