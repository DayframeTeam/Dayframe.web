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
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const shouldUseDark = saved === 'dark' || (!saved && prefersDark);
  document.body.classList.toggle('theme-dark', shouldUseDark);

  const tg = window.Telegram?.WebApp;
  if (!tg) return;

  tg.ready();

  const initDataUnsafe = tg.initDataUnsafe;
  console.log(initDataUnsafe);
  if (!initDataUnsafe) {
    window.location.href = TG_BOT_LINK;
    return;
  } else {
    (async () => {
      try {
        // Пробуем получить пользователя
        await authService.authUser(initDataUnsafe);
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

  return (
    <>
      <Header left={<UserProfile />} center={<HeaderNav />} right={<HeaderDropdown />} />
      <PageContainer />
    </>
  );
}

export default App;
