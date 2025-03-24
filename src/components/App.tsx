import { Header } from './Header/Header.tsx';
import { HeaderNav } from './HeaderNav/HeaderNav.tsx';
import { PageContainer } from './PageContainer/PageContainer.tsx';
import { ThemeToggle } from './ThemeToggle/ThemeToggle.tsx';

function App() {
  return (
    <>
      <Header center={<HeaderNav />} right={<ThemeToggle />} />
      <PageContainer />
    </>
  );
}

export default App;
