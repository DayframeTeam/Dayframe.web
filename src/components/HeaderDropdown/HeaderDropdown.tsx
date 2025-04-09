import { Settings } from 'lucide-react';
import Dropdown from '../ui/Dropdown/Dropdown';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import { LanguageToggle } from '../LanguageToggle/LanguageToggle';
import styles from './HeaderDropdown.module.scss';

export default function HeaderDropdown() {
  return (
    <Dropdown
      trigger={
        <button className={styles.trigger}>
          <Settings size={20} />
        </button>
      }
      position="left"
    >
      <div className={styles.item}>
        <ThemeToggle />
      </div>
      <div className={styles.item}>
        <LanguageToggle />
      </div>
    </Dropdown>
  );
}
