import styles from './TaskMetaInfo.module.scss';
import { Badge } from '../Badge/Badge';
import { getTemplateInfoByValue } from '../../utils/getTemplateInfoByValue';
import type { Task } from '../../types/dbTypes';

type Props = Readonly<{
  start_time?: string;
  duration?: string;
  exp?: number;
  category?: Task['category'];
  priority?: Task['priority'];
  repeat_rule?: Task['repeat_rule'];
  source?: Task['source'];
  description?: string;
}>;

export function TaskMetaInfo({
  start_time,
  duration,
  exp,
  category,
  priority,
  repeat_rule,
  source,
  description,
}: Props) {
  const categoryInfo = category ? getTemplateInfoByValue('category', category) : null;
  const priorityInfo = priority ? getTemplateInfoByValue('priority', priority) : null;

  return (
    <div className={styles.meta}>
      <div className={styles.wrapper}>
        <div className={styles.top}>
          {start_time && <span title="Время начала">🕒 {start_time.slice(0, 5)}</span>}

          {duration && <span title="Длительность">⏱ {duration}</span>}
          {typeof exp === 'number' && (
            <span className={styles.exp} title="Опыт за выполнение">
              +{exp} ⚡
            </span>
          )}
        </div>
        <div className={styles.buttom}>
          {categoryInfo && (
            <span title="Категория">
              <Badge {...categoryInfo} />
            </span>
          )}

          {priorityInfo && (
            <span title="Приоритет">
              <Badge {...priorityInfo} />
            </span>
          )}

          {repeat_rule && (
            <span className={styles.customBadge} title="Повторение">
              🔁{' '}
              {repeat_rule === 'daily'
                ? 'Каждый день'
                : repeat_rule === 'weekly'
                  ? 'Каждую неделю'
                  : 'Квест'}
            </span>
          )}

          {source && (
            <span title="Источник">
              <Badge label={source} priority={2} />
            </span>
          )}
        </div>
      </div>

      {description && (
        <p className={styles.note} title="Описание">
          {description}
        </p>
      )}
    </div>
  );
}
