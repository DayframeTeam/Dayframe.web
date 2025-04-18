import { memo, useState, useRef, useEffect } from 'react';
import { Button } from '../../../shared/UI/Button/Button';
import styles from './CalendarHeader.module.scss';
import { useTranslation } from 'react-i18next';
import { nanoid } from 'nanoid';

type Props = Readonly<{
  monthLabel: string;
  onPrev: () => void;
  onNext: () => void;
  onMonthSelect?: (monthIndex: number) => void;
  currentMonthIndex?: number;
  realCurrentMonth: number;
}>;

export const CalendarHeader = memo(
  ({
    monthLabel,
    onPrev,
    onNext,
    onMonthSelect,
    currentMonthIndex = new Date().getMonth(),
    realCurrentMonth = new Date().getMonth(),
  }: Props) => {
    const { t } = useTranslation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsDropdownOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    const monthNames = t('monthNames', { returnObjects: true }) as string[];

    const handleMonthClick = (monthIndex: number) => {
      if (onMonthSelect) {
        onMonthSelect(monthIndex);
      }
      setIsDropdownOpen(false);
    };

    return (
      <div className={styles.header}>
        <Button variant="secondary" size="normal" onClick={onPrev}>
          ←
        </Button>
        <div className={styles.monthSelector} ref={dropdownRef}>
          <Button
            className={styles.monthLabel}
            variant="secondary"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {monthLabel}
          </Button>
          {isDropdownOpen && (
            <div className={styles.dropdown}>
              {monthNames.map((month, index) => (
                <div
                  key={nanoid()}
                  className={`${styles.monthOption} 
                    ${index === currentMonthIndex ? styles.selected : ''} 
                    ${index === realCurrentMonth ? styles.current : ''}`}
                  onClick={() => handleMonthClick(index)}
                >
                  {month}
                </div>
              ))}
            </div>
          )}
        </div>
        <Button variant="secondary" size="normal" onClick={onNext}>
          →
        </Button>
      </div>
    );
  }
);

CalendarHeader.displayName = 'CalendarHeader';
