import { Header } from './Header/Header.tsx';
import { HeaderNav } from './HeaderNav/HeaderNav.tsx';
import { InitialDataLoader } from './InitialDataLoader.tsx';
import { PageContainer } from './PageContainer/PageContainer.tsx';
import LevelIndicator from './LevelIndicator/LevelIndicator.tsx';
import HeaderDropdown from './HeaderDropdown/HeaderDropdown.tsx';
import { useEffect } from 'react';

function App() {
  // Инициализация темы при старте приложения
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = saved === 'dark' || (!saved && prefersDark);

    document.body.classList.toggle('theme-dark', shouldUseDark);
  }, []);

  return (
    <>
      <Header left={<LevelIndicator />} center={<HeaderNav />} right={<HeaderDropdown />} />
      <InitialDataLoader>
        <PageContainer />
      </InitialDataLoader>
    </>
  );
}

export default App;
