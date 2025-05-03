import { useTranslation } from 'react-i18next';
import { PlusIcon } from 'lucide-react';
import { Button } from '../../../shared/UI/Button/Button';
import { memo } from 'react';
import { formatDateDayMonth } from '../../../utils/dateUtils';
import styles from './TaskSectionHeader.module.scss';
import { Weather } from '../../../widgets/Weather/Weather';

type TaskSectionHeaderProps = Readonly<{
  date: string;
  onAddTask: () => void;
}>;

export const TaskSectionHeader = memo(({ date, onAddTask }: TaskSectionHeaderProps) => {
  const { t } = useTranslation();
  const today = new Date().toLocaleDateString('sv-SE');
  const isToday = date === today;

  return (
    <div className={styles.container}>
      <Weather date={date} />

      <div className={styles.header}>
        <h2 className={styles.title}>
          {isToday
            ? t('taskSection.today')
            : t('taskSection.dateTasks', { date: formatDateDayMonth(date) })}
        </h2>
        <Button size="small" variant="secondary" onClick={onAddTask}>
          <span className={styles.buttonContent}>
            <PlusIcon />
          </span>
        </Button>
      </div>
    </div>
  );
});

TaskSectionHeader.displayName = 'TaskSectionHeader';
