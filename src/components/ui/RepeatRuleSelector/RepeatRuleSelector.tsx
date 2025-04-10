import { useState } from 'react';
import styles from './RepeatRuleSelector.module.scss';
import clsx from 'clsx';
import shared from '../shared.module.scss';

export type RepeatRule = 'daily' | 'weekly' | number[];

type Props = {
  value: RepeatRule;
  onChange: (rule: RepeatRule) => void;
};

const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

export default function RepeatRuleSelector({ value, onChange }: Props) {
  const [mode, setMode] = useState<'daily' | 'weekly' | 'custom'>(
    typeof value === 'string' ? value : 'custom'
  );

  const selectedDays: number[] = Array.isArray(value) ? value : [];

  const toggleDay = (dayIndex: number) => {
    const newDays = selectedDays.includes(dayIndex)
      ? selectedDays.filter((d) => d !== dayIndex)
      : [...selectedDays, dayIndex];
    onChange(newDays);
  };

  const handleModeChange = (newMode: 'daily' | 'weekly' | 'custom') => {
    setMode(newMode);
    if (newMode === 'daily') onChange('daily');
    else if (newMode === 'weekly') onChange('weekly');
    else onChange([]);
  };

  return (
    <div className={shared.wrapper}>
      <div className={styles.modes}>
        {['daily', 'weekly', 'custom'].map((m) => (
          <button
            key={m}
            onClick={() => handleModeChange(m as any)}
            className={clsx(styles.modeBtn, { [styles.active]: mode === m })}
          >
            {m === 'daily' && 'Ежедневно'}
            {m === 'weekly' && 'Еженедельно'}
            {m === 'custom' && 'По дням'}
          </button>
        ))}
      </div>

      {mode === 'custom' && (
        <div className={styles.days}>
          {days.map((day, idx) => (
            <button
              key={idx}
              onClick={() => toggleDay(idx)}
              className={clsx(styles.dayBtn, {
                [styles.selected]: selectedDays.includes(idx),
              })}
            >
              {day}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
