import { memo } from 'react';
import styles from './SeleectedDays.module.scss';
import { useTranslation } from 'react-i18next';
import { nanoid } from 'nanoid';
import shared from '../shared.module.scss';

type SelectedDaysProps = {
  selectedDays: number[]; // Array of numbers from 1 to 7 representing days of the week
  selectable?: boolean; // Whether days can be selected/deselected
  onChange?: (selectedDays: number[]) => void; // Callback when selection changes
  label?: string; // Optional label to display before the days
  className?: string; // Optional className for styling
};

export const SelectedDays = memo(
  ({ selectedDays, selectable = false, onChange, label, className = '' }: SelectedDaysProps) => {
    const { t } = useTranslation();

    const handleDayClick = (day: number) => {
      if (!selectable || !onChange) return;

      const newDays = selectedDays.includes(day)
        ? selectedDays.filter((d) => d !== day)
        : [...selectedDays, day].sort((a, b) => a - b);

      onChange(newDays);
    };

    // Get day names from translations
    const dayNames = t('weekdaysShort', { returnObjects: true }) as string[];

    // Reorder days to start from Monday (index 1) instead of Sunday (index 0)
    const reorderedDayNames = [...dayNames.slice(1), dayNames[0]];

    return (
      <div className={`${styles.wrapper} ${className}`}>
        {label && <span className={shared.label}>{label}</span>}
        <div className={styles.daysWrapper}>
          {reorderedDayNames.map((dayName, index) => {
            // Map index to the correct day number (1-7)
            // 0 -> 1 (Monday), 1 -> 2 (Tuesday), ..., 6 -> 7 (Sunday)
            const dayNumber = index + 1;
            const isSelected = selectedDays.includes(dayNumber);

            return (
              <div
                key={nanoid()}
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
