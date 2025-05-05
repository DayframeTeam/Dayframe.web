import { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from './modules/Header/Header';
import { HeaderDropdown } from './modules/Header/HeaderDropdown/HeaderDropdown';
import { HeaderNav } from './modules/Header/HeaderNav/HeaderNav';
import { UserProfile } from './modules/Header/UserProfile/UserProfile';
import { PageContainer } from './pages/PageContainer/PageContainer';
import { userService } from './entities/user/userService';
import { taskService } from './entities/task/taskService';
import { templateTasksService } from './entities/template-tasks/templateTasksService';
import { authService } from './entities/auth/authService';

const TG_BOT_LINK = 'https://t.me/Dayframe_bot';

function App() {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [hasChatId, setHasChatId] = useState<boolean>(false);
  const inited = useRef(false);

  // 1. Тема и язык из Telegram
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    tg.ready();

    const { colorScheme } = tg.themeParams || {};
    document.body.classList.toggle('theme-dark', colorScheme === 'dark');

    const userLang = tg.initDataUnsafe?.user?.language_code;
    if (userLang && userLang !== i18n.language) {
      i18n.changeLanguage(userLang);
    }
  }, [i18n]);

  // 2. Авторизация + загрузка данных
  useEffect(() => {
    if (inited.current) return;
    inited.current = true;

    const tg = window.Telegram?.WebApp;
    const chatId = tg?.initDataUnsafe?.user?.id ?? (import.meta.env.DEV ? 613434210 : undefined);

    if (!chatId) {
      setHasChatId(false);
      setIsLoading(false);
      return;
    }

    setHasChatId(true);

    // именованная async-функция вместо IIFE
    async function initializeUser() {
      try {
        await authService.authUserByChatId(Number(chatId));
        await userService.fetchAndStoreCurrentUser();
        await taskService.fetchAndStoreAll();
        await templateTasksService.fetchAndStoreAll();
      } catch (err) {
        console.error(err);
        alert('Ошибка загрузки пользователя');
      } finally {
        setIsLoading(false);
      }
    }

    initializeUser();
  }, []);

  if (isLoading) {
    // можно кинуть спиннер или просто null
    return null;
  }

  if (!hasChatId) {
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
