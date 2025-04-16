import { Day } from '../../../../types/dbTypes';
import { useState, memo } from 'react';
import styles from './TemplateDay.module.scss';
import { Button } from '../../../ui/Button/Button';
import { useTranslation } from 'react-i18next';
import { PlusIcon } from 'lucide-react';
import { CustomEditBtn } from '../../../ui/CustomEditBtn/CustomEditBtn';
import { TemplateTaskItem } from '../../TemplateTaskItem/TemplateTaskItem';
import { SelectedDays } from '../../../ui/SeleectedDays/SeleectedDays';
import { DayModal } from '../DayModal/DayModal';
import { nanoid } from 'nanoid';
import { TaskModal } from '../../../TaskModal/TaskModal';

type TemplateDayProps = {
  day: Day;
};

export const TemplateDay = memo(({ day }: TemplateDayProps) => {
  const { t } = useTranslation();
  const [showTasks, setShowTasks] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasTasks = day.tasks.length > 0;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.dayWrapper}>
      <div
        className={styles.dayWrapperInner}
        style={{
          paddingBottom: hasTasks ? 0 : undefined,
        }}
      >
        <div className={styles.dayHeader}>
          <div>
            <span style={{ fontWeight: 'var(--font-weight-big)' }}>{day.name}</span>
          </div>

          <Button size="small" variant="secondary" onClick={() => {}}>
            <span
              style={{
                display: 'flex',
                gap: '0.2rem',
                fontSize: 'var(--font-size-secondary)',
              }}
            >
              <PlusIcon />
              {/* {t('task.add')} */}
            </span>
          </Button>
        </div>
        {day.repeat_days && <SelectedDays selectedDays={day.repeat_days} selectable={false} />}
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
              <TemplateTaskItem key={nanoid()} templateTask={task} />
            ))}
          </div>
        )}
      </div>
      <CustomEditBtn borderColor="var(--bg-primary)" onClick={handleEditClick} />
      <DayModal isOpen={isModalOpen} onClose={handleCloseModal} day={day} />
      <TaskModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} type="DayTask" />
    </div>
  );
});

TemplateDay.displayName = 'TemplateDay';
