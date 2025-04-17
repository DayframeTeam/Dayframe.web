import { Header } from './Header/Header.tsx';
import { HeaderNav } from './HeaderNav/HeaderNav.tsx';
import { PageContainer } from './PageContainer/PageContainer.tsx';
import { HeaderDropdown } from './HeaderDropdown/HeaderDropdown.tsx';
import { UserProfile } from './User/UserProfile/UserProfile.tsx';

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
