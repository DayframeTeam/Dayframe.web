import { memo, useState, useEffect } from 'react';
import styles from './SeleectedDays.module.scss';
import { useTranslation } from 'react-i18next';

type SelectedDaysProps = {
  selectedDays: number[]; // Array of numbers from 1 to 7 representing days of the week
  selectable?: boolean; // Whether days can be selected/deselected
  onChange?: (selectedDays: number[]) => void; // Callback when selection changes
  label?: string; // Optional label to display before the days
  className?: string; // Optional className for styling
};

export const SelectedDays = memo(
  ({ selectedDays, selectable = false, onChange, label, className = '' }: SelectedDaysProps) => {
    const [days, setDays] = useState<number[]>(selectedDays);
    const { t } = useTranslation();

    // Update internal state when props change
    useEffect(() => {
      setDays(selectedDays);
    }, [selectedDays]);

    const handleDayClick = (day: number) => {
      if (!selectable || !onChange) return;

      const newDays = days.includes(day)
        ? days.filter((d) => d !== day)
        : [...days, day].sort((a, b) => a - b);

      setDays(newDays);
      onChange(newDays);
    };

    // Get day names from translations
    const dayNames = t('weekdaysShort', { returnObjects: true }) as string[];

    // Reorder days to start from Monday (index 1) instead of Sunday (index 0)
    const reorderedDayNames = [...dayNames.slice(1), dayNames[0]];

    return (
      <div className={`${styles.wrapper} ${className}`}>
        {label && <span className={styles.label}>{label}</span>}
        <div className={styles.daysWrapper}>
          {reorderedDayNames.map((dayName, index) => {
            // Map index to the correct day number (1-7)
            // 0 -> 1 (Monday), 1 -> 2 (Tuesday), ..., 6 -> 7 (Sunday)
            const dayNumber = index + 1;
            const isSelected = days.includes(dayNumber);

            return (
              <div
                key={dayNumber}
                className={`${styles.day} ${isSelected ? styles.selected : ''} ${selectable ? styles.selectable : ''}`}
                onClick={() => handleDayClick(dayNumber)}
                title={dayName}
              >
                {dayName}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

SelectedDays.displayName = 'SelectedDays';
