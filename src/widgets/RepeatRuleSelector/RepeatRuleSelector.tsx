import { useState, useEffect } from 'react';
import { RepeatRule } from '../../types/dbTypes';
import { SelectedDays } from '../SeleectedDays/SeleectedDays';
import styles from './RepeatRuleSelector.module.scss';
import { useTranslation } from 'react-i18next';
import { Badge } from '../../shared/UI/Badge/Badge';
import shared from '../../shared/UI/shared.module.scss';
import { Button } from '../../shared/UI/Button/Button';
import { TemplateTaskUtils } from '../../entities/template-tasks/template.tasks.utils';

type Props = {
  value: RepeatRule;
  onChange?: (value: RepeatRule) => void;
  selectable?: boolean;
  className?: string;
};

export default function RepeatRuleSelector({
  value,
  onChange,
  selectable = false,
  className,
}: Props) {
  const { t } = useTranslation();
  const rule = TemplateTaskUtils.parseRepeatRule(value);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<'weekly' | 'quests' | null>(null);

  // Initialize state based on the value prop
  useEffect(() => {
    if (Array.isArray(rule)) {
      setSelectedDays(rule);
      setSelectedOption(null);
    } else {
      setSelectedDays([]);
      setSelectedOption(rule);
    }
  }, [value]);

  // Handle day selection
  const handleDaysChange = (days: number[]) => {
    // If days are selected, clear any selected option
    if (days.length > 0) {
      setSelectedOption(null);
    }

    setSelectedDays(days);
    if (onChange) {
      onChange(days);
    }
  };

  // Handle option selection
  const handleOptionChange = (option: 'weekly' | 'quests') => {
    // If an option is selected, clear selected days
    setSelectedOption(option);
    setSelectedDays([]);

    if (onChange) {
      onChange(option);
    }
  };

  // Determine if we're in days selection mode
  const isDaysMode = Array.isArray(rule);

  return (
    <div className={`${shared.categoryWrapper} ${className}`}>
      {selectable ? (
        <>
          <SelectedDays
            selectedDays={selectedDays}
            selectable={true}
            onChange={handleDaysChange}
            label={t('templates.days.repeatDays')}
          />
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Button
              variant="secondary"
              className={`${styles.dayButton} ${selectedOption === 'weekly' ? styles.selected : ''}`}
              onClick={() => handleOptionChange('weekly')}
            >
              {t('task.repeat.weekly')}
            </Button>
            <Button
              variant="secondary"
              className={`${styles.dayButton} ${selectedOption === 'quests' ? styles.selected : ''}`}
              onClick={() => handleOptionChange('quests')}
            >
              {t('task.repeat.quest')}
            </Button>
          </div>
        </>
      ) : (
        <>
          {isDaysMode &&
            (rule.length < 7 ? (
              <SelectedDays
                selectedDays={rule as number[]}
                selectable={false}
                label={t('templates.days.repeatDays')}
              />
            ) : (
              <div className={styles.dayLabel}>{`🔁 ${t('task.repeat.daily')}`}</div>
            ))}
          {rule === 'weekly' && (
            <div className={styles.dayLabel}>{`🔁 ${t('task.repeat.weekly')}`}</div>
          )}
          {rule === 'quests' && (
            <div className={styles.dayLabel}>{`🔁 ${t('task.repeat.quest')}`}</div>
          )}
        </>
      )}
    </div>
  );
}
