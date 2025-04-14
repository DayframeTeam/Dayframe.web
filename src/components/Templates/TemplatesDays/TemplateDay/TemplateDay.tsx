import { Day } from '../../../../types/dbTypes';
import { useState, memo } from 'react';
import styles from './TemplateDay.module.scss';
import { Button } from '../../../ui/Button/Button';
import { useTranslation } from 'react-i18next';
import { PlusIcon } from 'lucide-react';
import { CustomEditBtn } from '../../../ui/CustomEditBtn/CustomEditBtn';
import { TemplateTaskItem } from '../../TemplateTaskItem/TemplateTaskItem';
import { SelectedDays } from '../../../ui/SeleectedDays/SeleectedDays';

type TemplateDayProps = {
  day: Day;
};

export const TemplateDay = memo(({ day }: TemplateDayProps) => {
  const { t } = useTranslation();
  const [showTasks, setShowTasks] = useState(false);
  const hasTasks = day.tasks.length > 0;

  return (
    <div className={styles.dayWrapper}>
      <div className={styles.dayWrapperInner}>
        <div className={styles.dayHeader}>
          <div>
            <span style={{ fontWeight: 'var(--font-weight-big)' }}>{day.name}</span>

          </div>

          <Button size="small" variant="secondary" onClick={() => {}}>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem',
                fontSize: 'var(--font-size-secondary)',
              }}
            >
              <PlusIcon />
              {t('task.add')}
            </span>
          </Button>
        </div>
        {day.repeat_days && (
              <SelectedDays
                className={styles.repeatDays}
                selectedDays={day.repeat_days}
                selectable={false}
              />
            )}
        {hasTasks && (
          <Button
            className={styles.taskToggleBtn}
            onClick={() => setShowTasks((prev) => !prev)}
            variant="secondary"
            size="small"
          >
            {showTasks ? '▲' : '▼'}
          </Button>
        )}
        {hasTasks && showTasks && (
          <div className={styles.tasksList}>
            {day.tasks.map((task) => (
              <TemplateTaskItem key={task.id} templateTask={task} />
            ))}
          </div>
        )}
      </div>
      <CustomEditBtn borderColor="var(--bg-primary)" onClick={() => {}} />
    </div>
  );
});

TemplateDay.displayName = 'TemplateDay';
