import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button/Button';

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const toggleLanguage = () => {
    const newLang = lang === 'ru' ? 'en' : 'ru';
    i18n.changeLanguage(newLang);
  };

  return (
    <Button variant="secondary" onClick={toggleLanguage}>
      {lang === 'ru' ? '🇷🇺' : '🇺🇸'}
    </Button>
  );
}
