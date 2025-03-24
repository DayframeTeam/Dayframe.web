import styles from './HeaderNav.module.scss';
import clsx from 'clsx';
import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Сегодня', to: '/today' },
  { label: 'Шаблоны', to: '/templates' },
  { label: 'Календарь', to: '/calendar' },
];

export function HeaderNav() {
  return (
    <nav className={styles.nav}>
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => clsx(styles.item, isActive && styles.active)}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
