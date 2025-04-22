import { useRef } from 'react';
import { Header } from './modules/Header/Header';
import { HeaderDropdown } from './modules/Header/HeaderDropdown/HeaderDropdown';
import { HeaderNav } from './modules/Header/HeaderNav/HeaderNav';
import { UserProfile } from './modules/Header/UserProfile/UserProfile';
import { PageContainer } from './pages/PageContainer/PageContainer';
import { userService } from './entities/user/userService';
import { taskService } from './entities/task/taskService';

function App() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const shouldUseDark = saved === 'dark' || (!saved && prefersDark);
  document.body.classList.toggle('theme-dark', shouldUseDark);
  console.log('App');

  const inited = useRef(false);

  if (!inited.current) {
    inited.current = true;
    // запускаем “одноразово” загрузку
    (async () => {
      console.log('init await');
      try {
        await userService.fetchAndStoreCurrentUser();
        await taskService.fetchAndStoreAll();
      } catch (e) {
        console.error(e);
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
