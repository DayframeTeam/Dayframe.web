import { useState } from 'react';
import { Button } from '../ui/Button/Button';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return saved === 'dark' || (!saved && prefersDark);
  });

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.body.classList.toggle('theme-dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <Button variant="secondary" onClick={toggleTheme}>
      {isDark ? '🌙' : '🌞'}
    </Button>
  );
}
