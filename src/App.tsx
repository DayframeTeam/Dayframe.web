import { useEffect, useRef, useState } from 'react';
import { Header } from './modules/Header/Header';
import { HeaderDropdown } from './modules/Header/HeaderDropdown/HeaderDropdown';
import { HeaderNav } from './modules/Header/HeaderNav/HeaderNav';
import { UserProfile } from './modules/Header/UserProfile/UserProfile';
import { PageContainer } from './pages/PageContainer/PageContainer';
import { userService } from './entities/user/userService';
import { taskService } from './entities/task/taskService';
import { templateTasksService } from './entities/template-tasks/templateTasksService';
import { authService } from './entities/auth/authService';
import { useTranslation } from 'react-i18next';

const TG_BOT_LINK = 'https://t.me/Dayframe_bot';

function App() {
  const { t } = useTranslation();
  const [showBotLink, setShowBotLink] = useState(false);
  const initialized = useRef(false);

  // Тема оформления
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = saved === 'dark' || (!saved && prefersDark);
    document.body.classList.toggle('theme-dark', shouldUseDark);
  }, []);

  // Инициализация Telegram WebApp и загрузка пользователя
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const tg = window.Telegram?.WebApp;

    const init = async () => {
      if (!tg) {
        setShowBotLink(true);
        return;
      }

      tg.ready(); // инициируем готовность Telegram WebApp

      try {
        const userId = tg.initDataUnsafe?.user?.id;

        let chatId: number | null = userId || null;

        if (import.meta.env.DEV && !chatId) {
          chatId = 613434210; // тестовый chat_id
        }

        if (!chatId) {
          setShowBotLink(true);
          return;
        }

        // Авторизация и загрузка данных
        await authService.authUserByChatId(chatId);
        await userService.fetchAndStoreCurrentUser();
        await taskService.fetchAndStoreAll();
        await templateTasksService.fetchAndStoreAll();
      } catch (err) {
        console.error('Ошибка инициализации:', err);
        alert('Ошибка загрузки пользователя');
      }
    };

    init();
  }, []);

  // Если зашли не из Telegram — предложить перейти в бот
  if (showBotLink) {
    return (
      <div style={{ padding: 32, textAlign: 'center' }}>
        <h2>{t('auth.register.title')}</h2>
        <a href={TG_BOT_LINK} target="_blank" rel="noopener noreferrer">
          {t('auth.register.link')}
        </a>
        <p>{t('auth.register.description')}</p>
      </div>
    );
  }

  return (
    <>
      <Header left={<UserProfile />} center={<HeaderNav />} right={<HeaderDropdown />} />
      <PageContainer />
    </>
  );
}

export default App;
