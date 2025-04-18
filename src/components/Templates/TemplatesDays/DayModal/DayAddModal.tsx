import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../../shared/UI/Button/Button';
import { TextInput } from '../../../../shared/UI/TextInput/TextInput';
import { SelectedDays } from '../../../../widgets/SeleectedDays/SeleectedDays';
import styles from './DayModal.module.scss';

export const DayAddModal = memo(() => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [repeatDays, setRepeatDays] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (name.trim() === '') {
      alert(t('templates.days.nameRequired'));
      return;
    }

    setIsSubmitting(true);
    try {
      // Здесь будет логика создания нового дня
      // await createDay({ name, repeat_days: repeatDays });
      console.log('Creating day:', { name, repeat_days: repeatDays });
    } catch (error) {
      console.error('Error creating day:', error);
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
          {isSubmitting ? t('common.creating') : t('common.create')}
        </Button>
      </div>
    </form>
  );
});

DayAddModal.displayName = 'DayAddModal';
