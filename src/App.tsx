import './styles/index.scss';
import './styles/variables.css';
import './sw.ts';
import './i18n';
import { Header } from './modules/Header/Header';
import { HeaderDropdown } from './modules/Header/HeaderDropdown/HeaderDropdown';
import { HeaderNav } from './modules/Header/HeaderNav/HeaderNav';
import { UserProfile } from './modules/Header/UserProfile/UserProfile';
import { PageContainer } from './pages/PageContainer/PageContainer';
import { useTelegramAuth } from './hooks/useTelegramAuth';

const LoadingSpinner = () => (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-primary)',
      zIndex: 9999,
    }}
  >
    <div
      style={{
        width: '50px',
        height: '50px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid var(--text-primary)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}
    />
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

const ErrorScreen = () => (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      padding: '2rem',
      textAlign: 'center',
      zIndex: 9999,
    }}
  >
    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
    <h1 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem' }}>Ошибка загрузки</h1>
    <p style={{ margin: '0 0 2rem 0', color: 'var(--text-secondary)' }}>
      Произошла ошибка при инициализации приложения
    </p>
    <button
      onClick={() => window.location.reload()}
      style={{
        padding: '0.75rem 1.5rem',
        backgroundColor: 'var(--accent)',
        color: 'var(--text-primary)',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1rem',
      }}
    >
      Перезагрузить
    </button>
  </div>
);

function App() {
  const { isLoading, isError } = useTelegramAuth();

  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const shouldUseDark = saved === 'dark' || (!saved && prefersDark);
  document.body.classList.toggle('theme-dark', shouldUseDark);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorScreen />;
  }

  return (
    <>
      <Header left={<UserProfile />} center={<HeaderNav />} right={<HeaderDropdown />} />
      <PageContainer />
    </>
  );
}

export default App;
