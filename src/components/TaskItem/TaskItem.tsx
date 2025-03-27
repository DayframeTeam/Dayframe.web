import { useEffect, useRef, useState } from 'react';
import type { Task, TemplateTask } from '../../types/dbTypes';
import { getPriorityColorIndex } from '../../utils/getPriorityColorIndex';
import styles from './TaskItem.module.scss';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { Checkbox } from '../../components/ui/Checkbox/Checkbox';
import { Badge } from '../../components/ui/Badge/Badge';
import SubtaskList from '../ui/SubtaskList/SubtaskList';
import { toLocalDateString } from '../../utils/dateUtils';
import { updateTaskStatus } from '../../features/tasks/tasksThunks';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';

type Props = {
  task: Task | TemplateTask;
};

export default function TaskItem({ task }: Props) {
  const isTemplate = 'repeat_rule' in task;
  const [showSubtasks, setShowSubtasks] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [isUpdating, setIsUpdating] = useState(false);
  const prefix = isTemplate ? 'template' : 'task';
  const colorIndex = getPriorityColorIndex(task.priority);
  const repeatLabel = isTemplate
    ? Array.isArray(task.repeat_rule)
      ? task.repeat_rule.map((d) => ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][d]).join(', ')
      : task.repeat_rule === 'daily'
        ? t('task.repeat.daily')
        : t('task.repeat.weekly')
    : null;

  const hasSubtasks =
    !isTemplate && 'subtasks' in task && task.subtasks && task.subtasks.length > 0;
  const completedCount = task.is_done
    ? task.subtasks.length
    : hasSubtasks
      ? task.subtasks.filter((s) => s.is_done).length
      : 0;
  const progressPercent = completedCount / task.subtasks.length;
  const progressColor =
    progressPercent === 1
      ? 'var(--subtask-progress-complete)'
      : 'var(--subtask-progress-incomplete)';

  const [showXPAnim, setShowXPAnim] = useState(false);
  const wasDoneRef = useRef(task.is_done);

  useEffect(() => {
    // Если задача только что была выполнена (is_done поменялось с false на true)
    if (!wasDoneRef.current && task.is_done && task.exp > 0) {
      setShowXPAnim(true);
      setTimeout(() => setShowXPAnim(false), 1000);
    }

    // Обновляем реф для следующего сравнения
    wasDoneRef.current = task.is_done;
  }, [task.is_done, task.exp]);

  return (
    <li
      className={clsx(styles.taskItem, !isTemplate && task.is_done && styles.completed)}
      style={{ borderLeftColor: `var(--select-color-${colorIndex})` }}
    >
      <div
        className={styles.wrapper}
        onClick={() => {
          if (isTemplate || isUpdating) return;
          setIsUpdating(true);
          dispatch(updateTaskStatus({ id: task.id, is_done: !task.is_done })).finally(() =>
            setIsUpdating(false)
          );
        }}
      >
        <div className={styles.header}>
          {!isTemplate && (
            <Checkbox
              id={`${prefix}-${task.id}`}
              checked={task.is_done}
              disabled
              // disabled={isUpdating}
              // onChange={(checked) => {
              //   if (isUpdating) return;
              //   setIsUpdating(true);
              //   dispatch(updateTaskStatus({ id: task.id, is_done: checked })).finally(() =>
              //     setIsUpdating(false)
              //   );
              // }}
            />
          )}

          <div className={styles.titleBlock}>
            <span
              title={task.title}
              className={clsx(styles.title, !isTemplate && task.is_done && styles.completedText)}
            >
              {task.title}
            </span>

            {hasSubtasks && (
              <div className={styles.subtaskSummary} title={t('task.subtasks.progress')}>
                <div className={styles.subtaskProgress}>
                  <div
                    className={styles.subtaskProgressBar}
                    style={{
                      width: `${progressPercent * 100}%`,
                      background: progressColor,
                    }}
                  />
                </div>
                <div className={styles.subtaskText} style={{ color: progressColor }}>
                  {completedCount}/{task.subtasks.length}
                </div>
              </div>
            )}

            {task.exp > 0 && (
              <div title={t('task.exp')} className={styles.xp}>
                +{task.exp}⚡{showXPAnim && <span className={styles.xpAnim}>+{task.exp}⚡</span>}
              </div>
            )}
          </div>

          {isTemplate && (
            <Badge label={task.is_done ? t('task.status.active') : t('task.status.inactive')} />
          )}
        </div>

        {task.description && <div className={styles.description}>{task.description}</div>}

        <div className={styles.meta}>
          {task.category && <Badge label={task.category} title={t('task.category')} />}
          {task.priority && (
            <Badge
              label={'🎯 ' + t(`task.priorityType.${task.priority}`)}
              num={colorIndex}
              title={t('task.priority')}
            />
          )}
        </div>

        {(task.start_time || task.end_time || task.duration) && (
          <div className={styles.timing}>
            {task.start_time && (
              <span title={t('task.timing.start')}>
                {t('task.timing.from')} {task.start_time}
              </span>
            )}
            {task.end_time && (
              <span title={t('task.timing.end')}>
                {t('task.timing.to')} {task.end_time}
              </span>
            )}
            {task.duration && <span title={t('task.timing.duration')}>⏳ {task.duration}</span>}
          </div>
        )}

        {!isTemplate && task.task_date && (
          <div className={styles.date}>
            📅 {t('task.date')}: {toLocalDateString(task.task_date)}
          </div>
        )}

        {isTemplate && (
          <>
            <div className={styles.repeat}>
              🔁 {t('task.repeat.label')}: {repeatLabel}
            </div>
            {task.start_date && (
              <div className={styles.range}>
                {t('task.repeat.from')}: {task.start_date}
              </div>
            )}
            {task.end_date && (
              <div className={styles.range}>
                {t('task.repeat.to')}: {task.end_date}
              </div>
            )}
          </>
        )}
      </div>
      {hasSubtasks && (
        <button
          className={styles.subtaskToggle}
          onClick={() => setShowSubtasks((prev) => !prev)}
          title={t('task.subTask.visibility')}
          aria-label={t('task.subTask.visibility')}
        >
          {showSubtasks ? '▲' : '▼'}
        </button>
      )}
      {hasSubtasks && showSubtasks && (
        <div className={styles.subtaskBlock}>
          <SubtaskList
            subtasks={task.subtasks.map((s) => ({
              ...s,
              is_done: task.is_done ? true : s.is_done,
            }))}
          />
        </div>
      )}
    </li>
  );
}
