import { Header } from './Header/Header.tsx';
import { HeaderNav } from './HeaderNav/HeaderNav.tsx';
import { InitialDataLoader } from './InitialDataLoader.tsx';
import { LanguageToggle } from './LanguageToggle/LanguageToggle.tsx';
import { PageContainer } from './PageContainer/PageContainer.tsx';
import { ThemeToggle } from './ThemeToggle/ThemeToggle.tsx';

function App() {
  return (
    <>
      <InitialDataLoader />
      <Header
        center={<HeaderNav />}
        right={
          <>
            <ThemeToggle /> <LanguageToggle />
          </>
        }
      />
      <PageContainer />
    </>
  );
}

export default App;
