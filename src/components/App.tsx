import { Header } from './Header/Header.tsx';
import { HeaderNav } from './HeaderNav/HeaderNav.tsx';
import { InitialDataLoader } from './InitialDataLoader.tsx';
import { LanguageToggle } from './LanguageToggle/LanguageToggle.tsx';
import { PageContainer } from './PageContainer/PageContainer.tsx';
import { ThemeToggle } from './ThemeToggle/ThemeToggle.tsx';
import UserProfile from './UseerProfile/UseerProfilel.tsx';

function App() {
  return (
    <>
      <Header
        left={<UserProfile />}
        center={<HeaderNav />}
        right={
          <div style={{ width: 'max-content' }}>
            <ThemeToggle /> <LanguageToggle />
          </div>
        }
      />
      <InitialDataLoader>
        <PageContainer />
      </InitialDataLoader>
    </>
  );
}

export default App;
