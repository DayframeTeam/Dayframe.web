import { useEffect, useState } from 'react';
import styles from './ThemeToggle.module.scss';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  const applyTheme = (dark: boolean) => {
    const root = document.body;
    root.classList.toggle('theme-dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  };

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = saved === 'dark' || (!saved && prefersDark);
    setIsDark(shouldUseDark);
    applyTheme(shouldUseDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    applyTheme(newTheme);
  };

  return (
    <button onClick={toggleTheme} className={styles.button}>
      {isDark ? '🌙' : '🌞'}
    </button>
  );
}
