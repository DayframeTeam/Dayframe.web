import { ReactNode, useState, useRef, useEffect } from 'react';
import styles from './Dropdown.module.scss';

interface DropdownProps {
  trigger: ReactNode; // Компонент-триггер (кнопка/иконка)
  children: ReactNode; // Содержимое дропдауна
  position?: 'left' | 'right'; // Позиция выпадающего меню
}

export default function Dropdown({ trigger, children, position = 'right' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Закрываем дропдаун при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <div className={styles.trigger} onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      {isOpen && <div className={`${styles.content} ${styles[position]}`}>{children}</div>}
    </div>
  );
}
