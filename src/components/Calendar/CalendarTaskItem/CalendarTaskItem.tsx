import styles from './CalendarTaskItem.module.scss';
import { CalendarEvent } from '../../../types/dbTypes';
import { Checkbox } from '../../Checkbox/Checkbox';
import { Button } from '../../Button/Button';
import { useId } from 'react';
import { TaskMetaInfo } from '../../TaskMetaInfo/TaskMetaInfo';
import clsx from 'clsx';

type Props = Readonly<{
  event: CalendarEvent;
  onMarkDone: (id: number) => void;
  onDelete: (id: number) => void;
}>;

export function CalendarTaskItem({ event, onMarkDone, onDelete }: Props) {
  const checkboxId = useId();
  const isDone = event.status === 'done';

  return (
    <div className={clsx(styles.wrapper, { [styles.doneOpacity]: isDone })}>
      <div className={styles.row}>
        <label htmlFor={checkboxId} className={styles.checkboxLabel}>
          <Checkbox
            checked={isDone}
            onChange={() => onMarkDone(event.id)}
            id={checkboxId}
          />
          <div className={styles.text}>
            <span className={isDone ? styles.done : ''}>{event.title}</span>
          </div>
        </label>

        <Button onClick={() => onDelete(event.id)} variant="secondary" size="small">
          🗑 Удалить
        </Button>
      </div>

      <TaskMetaInfo
        start_time={event.start_time}
        duration={event.duration}
        exp={event.exp}
        category={event.category}
        priority={event.priority}
        repeat_rule={event.repeat_rule}
        description={event.description}
      />
    </div>
  );
}
