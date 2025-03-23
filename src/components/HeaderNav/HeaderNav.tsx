import styles from './HeaderNav.module.scss';
import clsx from 'clsx';
import { useState } from 'react';

const navItems = ['Сегодня', 'Шаблоны', 'Календарь'];

export function HeaderNav() {
  const [active, setActive] = useState('Сегодня');

  return (
    <nav className={styles.nav}>
      {navItems.map((item) => (
        <button
          key={item}
          className={clsx(styles.item, active === item && styles.active)}
          onClick={() => setActive(item)}
        >
          {item}
        </button>
      ))}
    </nav>
  );
}
