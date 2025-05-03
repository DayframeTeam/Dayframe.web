import { memo, useState, useRef, useEffect } from 'react';
import { Button } from '../../../shared/UI/Button/Button';
import styles from './CalendarHeader.module.scss';
import { useTranslation } from 'react-i18next';
import { nanoid } from 'nanoid';

type Props = Readonly<{
  month: number;
  year: number;
  onMonthChange: (month: number, year: number) => void;
}>;

export const CalendarHeader = memo(({ month, year, onMonthChange }: Props) => {
  const { t } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Текущий месяц (для выделения в выпадающем списке)
  const realCurrentMonth = new Date().getMonth();
  const realCurrentYear = new Date().getFullYear();

  // Месяц в формате строки для отображения
  const monthNames = t('monthNames', { returnObjects: true }) as string[];
  const monthLabel = `${monthNames[month]} ${year}`;

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

  // Обработчики кнопок
  const handlePrev = () => {
    if (month === 0) {
      onMonthChange(11, year - 1);
    } else {
      onMonthChange(month - 1, year);
    }
  };

  const handleNext = () => {
    if (month === 11) {
      onMonthChange(0, year + 1);
    } else {
      onMonthChange(month + 1, year);
    }
  };

  const handleMonthClick = (monthIndex: number) => {
    onMonthChange(monthIndex, year);
    setIsDropdownOpen(false);
  };

  return (
    <div className={styles.header}>
      <Button variant="secondary" size="normal" onClick={handlePrev}>
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
            {monthNames.map((monthName, index) => (
              <div
                key={nanoid()}
                className={`${styles.monthOption} 
                  ${index === month ? styles.selected : ''} 
                  ${index === realCurrentMonth && year === realCurrentYear ? styles.current : ''}`}
                onClick={() => handleMonthClick(index)}
              >
                {monthName}
              </div>
            ))}
          </div>
        )}
      </div>
      <Button variant="secondary" size="normal" onClick={handleNext}>
        →
      </Button>
    </div>
  );
});

CalendarHeader.displayName = 'CalendarHeader';
