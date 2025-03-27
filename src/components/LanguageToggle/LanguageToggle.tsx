import { useTranslation } from 'react-i18next';
import styles from './LanguageToggle.module.scss';

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const toggleLanguage = () => {
    const newLang = lang === 'ru' ? 'en' : 'ru';
    i18n.changeLanguage(newLang);
  };

  return (
    <button className={styles.button} onClick={toggleLanguage}>
      {lang === 'ru' ? '🇷🇺' : '🇺🇸'}
    </button>
  );
}
