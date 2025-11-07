import { useEffect, useState, useRef } from 'react';
import { authService } from '../entities/auth/authService';
import { userService } from '../entities/user/userService';
import { taskService } from '../entities/task/taskService';
import { templateTasksService } from '../entities/template-tasks/templateTasksService';

const TG_BOT_LINK = 'https://t.me/Dayframe_bot';

export const useTelegramAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const isInitialized = useRef(false);

  useEffect(() => {
    // Защита от повторных вызовов (включая StrictMode и ре-рендеры)
    if (isInitialized.current) {
      return;
    }
    isInitialized.current = true;

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

        // Продакшн режим - ждем загрузки Telegram WebApp скрипта
        // Скрипт загружается асинхронно, нужно дождаться его готовности
        let tg = window.Telegram?.WebApp;

        // Если WebApp еще не загружен, ждем с повторными попытками
        if (!tg) {
          const maxAttempts = 50; // 5 секунд максимум (50 * 100ms)
          let attempts = 0;

          while (!tg && attempts < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, 100));
            tg = window.Telegram?.WebApp;
            attempts++;
          }
        }

        if (!tg) {
          console.error('Telegram WebApp не загружен после ожидания');
          setIsError(true);
          setIsLoading(false);
          return;
        }

        // Уведомляем Telegram, что приложение готово
        tg.ready();

        // Небольшая задержка для инициализации WebApp
        await new Promise((resolve) => setTimeout(resolve, 100));

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
        console.error('Ошибка инициализации:', e);
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
