import { Header } from '../widgets/Header/Header.tsx';
import { HeaderNav } from '../widgets/Header/HeaderNav/HeaderNav.tsx';
import { PageContainer } from '../pages/PageContainer/PageContainer.tsx';
import { HeaderDropdown } from '../widgets/Header/HeaderDropdown/HeaderDropdown.tsx';
import { UserProfile } from '../widgets/Header/UserProfile/UserProfile.tsx';

function App() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const shouldUseDark = saved === 'dark' || (!saved && prefersDark);
  document.body.classList.toggle('theme-dark', shouldUseDark);
  console.log('App');
  return (
    <>
      <Header left={<UserProfile />} center={<HeaderNav />} right={<HeaderDropdown />} />
      <PageContainer />
    </>
  );
}

export default App;
