import { useTranslation } from 'react-i18next';
import TaskList from '../TaskList/TaskList';
import type { Task } from '../../types/dbTypes';
import { PlusIcon } from 'lucide-react';
import { Button } from '../ui/Button/Button';
import { memo, useState, useEffect } from 'react';
import { TaskModal } from '../TaskModal/TaskModal';
import { WeatherDisplay } from '../WeatherDisplay';
import { LocationSettings } from '../LocationSettings';
import { formatDateDayMonth } from '../../utils/dateUtils';

type Props = Readonly<{
  date: string; // в формате 'YYYY-MM-DD'
  tasks: Task[];
}>;

export const TaskSection = memo(({ date, tasks }: Props) => {
  const { t } = useTranslation();
  const today = new Date().toLocaleDateString('sv-SE');
  const isToday = date === today;
  const [isAdding, setIsAdding] = useState(false);
  const [location, setLocation] = useState<string>('');

  // Проверяем, является ли дата прошедшей
  const isPastDate = new Date(date) < new Date(new Date().setHours(0, 0, 0, 0));

  // Load saved location from localStorage on component mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('weatherLocation');
    if (savedLocation) {
      setLocation(savedLocation);
    }
  }, []);

  const handleLocationChange = (newLocation: string) => {
    setLocation(newLocation);
  };

  return (
    <section>
      {!isPastDate && location && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <WeatherDisplay location={location} date={date} />
          <LocationSettings onLocationChange={handleLocationChange} />
        </div>
      )}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
        }}
      >
        <h2 style={{ fontSize: '1.5rem', margin: '0' }}>
          {isToday
            ? t('taskSection.today')
            : t('taskSection.dateTasks', { date: formatDateDayMonth(date) })}
        </h2>
        <Button size="small" variant="secondary" onClick={() => setIsAdding(true)}>
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

      <TaskList tasks={tasks} />
      {isAdding && (
        <TaskModal
          isOpen={isAdding}
          onClose={() => setIsAdding(false)}
          date={isToday ? undefined : date}
        />
      )}
    </section>
  );
});

TaskSection.displayName = 'TaskSection';
