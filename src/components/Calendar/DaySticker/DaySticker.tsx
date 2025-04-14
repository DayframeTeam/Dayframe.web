import styles from './DaySticker.module.scss';
import type { Task } from '../../../types/dbTypes';
import { getPriorityColorIndex } from '../../../utils/getPriorityColorIndex';
import { useState } from 'react';
import { TaskSection } from '../../TaskSection/TaskSection';
import { Modal } from '../../Modal/Modal';
import { useTranslation } from 'react-i18next';
import { nanoid } from 'nanoid';

type Props = Readonly<{
  date: string; // 'YYYY-MM-DD'
  isToday?: boolean;
  tasks: Task[];
}>;

export function DaySticker({ date, isToday = false, tasks = [] }: Props) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  // Проверяем, что день уже прошёл:
  const isPast = new Date(date) < new Date(new Date().toDateString());

  // Получаем день месяца
  const dayNumber = new Date(date).getDate();

  // Сортируем задачи:
  // 1) Сначала те, у которых есть start_time (по возрастанию)
  // 2) В конце те, у которых start_time отсутствует
  const sortedTasks = [...tasks].sort((a, b) => {
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

  return (
    <>
      <div
        className={`${styles.sticker} ${isToday ? styles.today : ''} ${isPast ? styles.past : ''}`}
        onClick={() => setOpen(true)}
        title={t('ui.clickToOpen')}
      >
        <div className={styles.day}>{dayNumber}</div>
        <div className={styles.events}>
          {sortedTasks.map((task) => (
            <div
              key={nanoid()}
              className={styles.event}
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
        <Modal isOpen={open} onClose={() => setOpen(false)}>
          <TaskSection date={date} tasks={sortedTasks} />
        </Modal>
      )}
    </>
  );
}
