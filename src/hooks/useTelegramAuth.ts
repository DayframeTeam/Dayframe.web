import { useLayoutEffect, useState } from 'react';
import { authService } from '../entities/auth/authService';
import { userService } from '../entities/user/userService';
import { taskService } from '../entities/task/taskService';
import { templateTasksService } from '../entities/template-tasks/templateTasksService';

const TG_BOT_LINK = 'https://t.me/Dayframe_bot';

export const useTelegramAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useLayoutEffect(() => {
    const initializeTelegram = async () => {
      try {
        setIsLoading(true);

        // DEV режим
        if (import.meta.env.VITE_DEV_MODE) {
          await authService.authDevUser();

          // Потом параллельно загружаем все данные
          await Promise.all([
            userService.fetchAndStoreCurrentUser(),
            taskService.fetchAndStoreAll(),
            templateTasksService.fetchAndStoreAll(),
          ]);

          setIsError(false);
          return;
        }

        // Продакшн режим - обычная логика
        const tg = window.Telegram?.WebApp;

        if (!tg) {
          setIsError(true);
          setIsLoading(false);
          return;
        }

        tg.ready();
        const initData = tg.initData;

        if (!initData) {
          window.location.href = TG_BOT_LINK;
          return;
        }

        // Сначала авторизуемся
        await authService.authUser(initData);

        // Потом параллельно загружаем все данные
        await Promise.all([
          userService.fetchAndStoreCurrentUser(),
          taskService.fetchAndStoreAll(),
          templateTasksService.fetchAndStoreAll(),
        ]);

        setIsError(false);
      } catch (e) {
        console.error(e);
        setIsError(true);
        alert('Ошибка загрузки пользователя');
      } finally {
        setIsLoading(false);
      }
    };

    initializeTelegram();
  }, []);

  return {
    isLoading,
    isError,
  };
};
