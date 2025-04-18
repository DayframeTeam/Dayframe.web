import { memo, useState, useEffect } from 'react';
import { Day } from '../../../../types/dbTypes';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../../shared/UI/Button/Button';
import { TextInput } from '../../../../shared/UI/TextInput/TextInput';
import { SelectedDays } from '../../../../widgets/SeleectedDays/SeleectedDays';
import styles from './DayModal.module.scss';

type DayEditModalProps = {
  day: Day;
};

export const DayEditModal = memo(({ day }: DayEditModalProps) => {
  const { t } = useTranslation();
  const [name, setName] = useState(day.name);
  const [repeatDays, setRepeatDays] = useState<number[]>(day.repeat_days || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setName(day.name);
    setRepeatDays(day.repeat_days || []);
  }, [day]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (name.trim() === '') {
      alert(t('templates.days.nameRequired'));
      return;
    }

    setIsSubmitting(true);
    try {
      // Здесь будет логика обновления дня
      // await updateDay({ id: day.id, name, repeat_days: repeatDays });
      console.log('Updating day:', { id: day.id, name, repeat_days: repeatDays });
    } catch (error) {
      console.error('Error updating day:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <TextInput
          id="dayName"
          value={name}
          label={t('templates.days.name')}
          onChange={(value: string) => setName(value)}
          placeholder={t('templates.days.namePlaceholder')}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <SelectedDays
          selectedDays={repeatDays}
          label={t('templates.days.repeatDays')}
          selectable={true}
          onChange={setRepeatDays}
        />
      </div>

      <div className={styles.actions}>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t('common.saving') : t('common.save')}
        </Button>
      </div>
    </form>
  );
});

DayEditModal.displayName = 'DayEditModal';
