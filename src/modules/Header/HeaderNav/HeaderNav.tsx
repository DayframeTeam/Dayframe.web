import styles from './HeaderNav.module.scss';
import clsx from 'clsx';
import { nanoid } from 'nanoid';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

export function HeaderNav() {
  const { t } = useTranslation();
  const navItems = [
    { label: t('nav.today'), to: '/today' },
    { label: t('nav.templates'), to: '/templates' },
    { label: t('nav.calendar'), to: '/calendar' },
  ];

  return (
    <nav className={styles.nav}>
      {navItems.map((item) => (
        <NavLink
          key={nanoid()}
          to={item.to}
          className={({ isActive }) => clsx(styles.item, isActive && styles.active)}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
