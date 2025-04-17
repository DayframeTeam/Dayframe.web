import React, { useMemo, useState } from 'react';
import styles from './DaySticker.module.scss';
import type { Task } from '../../../types/dbTypes';
import { getPriorityColorIndex } from '../../../utils/getPriorityColorIndex';
import { TaskSection } from '../../TaskSection/TaskSection';
import { Modal } from '../../Modal/Modal';
import { useTranslation } from 'react-i18next';

type Props = Readonly<{
  date: string; // 'YYYY-MM-DD'
  isToday?: boolean;
  tasks: Task[];
}>;

export const DaySticker = React.memo(({ date, isToday = false, tasks = [] }: Props) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  // Проверяем, что день уже прошёл
  const isPast = new Date(date) < new Date(new Date().toDateString());

  // Получаем день месяца
  const dayNumber = new Date(date).getDate();

  // Сортируем задачи
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      const aTime = a.start_time;
      const bTime = b.start_time;

      // Если у обоих нет времени, оставляем их как есть
      if (!aTime && !bTime) return 0;
      // Если у a нет времени — отправляем его в конец
      if (!aTime) return 1;
      // Если у b нет времени — отправляем его в конец
      if (!bTime) return -1;

      // Иначе сравниваем строки "HH:MM" в алфавитном порядке
      return aTime.localeCompare(bTime);
    });
  }, [tasks]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  console.log('DaySticker');
  return (
    <>
      <div
        className={`${styles.sticker} ${isToday ? styles.today : ''} ${isPast ? styles.past : ''}`}
        onClick={handleOpen}
        title={t('ui.clickToOpen')}
      >
        <div className={styles.day}>{dayNumber}</div>
        <div className={styles.events}>
          {sortedTasks.map((task) => (
            <div
              key={task.special_id || task.id}
              className={`${styles.event} ${task.is_done ? styles.completed : ''}`}
              style={{
                borderLeftColor: `var(--select-color-${getPriorityColorIndex(task.priority)})`,
              }}
              title={task.title}
            >
              {task.start_time?.slice(0, 5)} {task.title}
            </div>
          ))}
        </div>
      </div>

      {open && (
        <Modal isOpen={open} onClose={handleClose}>
          <TaskSection date={date} taskIds={sortedTasks.map((task) => task.special_id)} />
        </Modal>
      )}
    </>
  );
});

DaySticker.displayName = 'DaySticker';
