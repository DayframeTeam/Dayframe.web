import { useMemo, useState } from 'react';
import { CalendarHeader } from './CalendarHeader/CalendarHeader';
import { CalendarGrid } from './CalendarGrid/CalendarGrid';
import { Task } from '../../types/dbTypes';
import { useTranslation } from 'react-i18next';

const today = new Date();

type Props = Readonly<{
  tasks: Task[];
}>;

export default function Calendar({ tasks }: Props) {
  const { t } = useTranslation();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const currentDay =
    today.getMonth() === month && today.getFullYear() === year ? today.getDate() : 0;

  const handlePrev = () => {
    if (month === 0) {
      setMonth(11);
      setYear((prev) => prev - 1);
    } else {
      setMonth((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (month === 11) {
      setMonth(0);
      setYear((prev) => prev + 1);
    } else {
      setMonth((prev) => prev + 1);
    }
  };

  const monthNames = t('monthNames', { returnObjects: true }) as string[];
  const monthLabel = `${monthNames[month]} ${year}`;

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (!task.task_date) return false;

      const tasksDate = new Date(task.task_date);

      return tasksDate.getFullYear() === year && tasksDate.getMonth() === month;
    });
  }, [tasks, year, month]);

  return (
    <div style={{ padding: '1rem' }}>
      <CalendarHeader monthLabel={monthLabel} onPrev={handlePrev} onNext={handleNext} />
      <CalendarGrid
        daysInMonth={daysInMonth}
        currentDay={currentDay}
        year={year}
        month={month}
        tasks={filteredTasks}
      />
    </div>
  );
}
