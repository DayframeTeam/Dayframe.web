import { useRef, useState } from 'react';
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
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const shouldUseDark = saved === 'dark' || (!saved && prefersDark);
  document.body.classList.toggle('theme-dark', shouldUseDark);

  const [showBotLink, setShowBotLink] = useState(false);
  const inited = useRef(false);

  if (!inited.current) {
    inited.current = true;

    const tg = window.Telegram?.WebApp;
    let chat_id = tg?.initDataUnsafe?.user?.id;

    if (import.meta.env.DEV && !chat_id) {
      chat_id = 613434210;
    }

    if (!chat_id) {
      setShowBotLink(true);
    } else {
      (async () => {
        try {
          // Пробуем получить пользователя
          await authService.authUserByChatId(Number(chat_id));
          // Если не выбросило ошибку — пользователь найден, продолжаем загрузку
          await userService.fetchAndStoreCurrentUser();
          await taskService.fetchAndStoreAll();
          await templateTasksService.fetchAndStoreAll();
        } catch (e) {
          console.error(e);
          alert('Ошибка загрузки пользователя');
        }
      })();
    }
  }

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
