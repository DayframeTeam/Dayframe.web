import { useRef, useState } from 'react';
import type { Task } from '../../../../types/dbTypes';
import { getPriorityColorIndex } from '../../../../utils/getPriorityColorIndex';
import { formatTime, calculateDuration } from '../../../../utils/dateUtils';
import styles from './TaskItem.module.scss';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { Checkbox } from '../../../../shared/UI/Checkbox/Checkbox';
import { Badge } from '../../../../shared/UI/Badge/Badge';
import { SubtaskList } from '../../../../widgets/SubtaskList/SubtaskList';
import { Button } from '../../../../shared/UI/Button/Button';
import { TaskModal } from '../../TaskModal/TaskModal';
import { CustomEditBtn } from '../../../../shared/UI/CustomEditBtn/CustomEditBtn';
import { taskService } from '../../../../entities/task/taskService';
import { userService } from '../../../../entities/user/userService';

type Props = Readonly<{
  task: Task;
}>;

export default function TaskItem({ task }: Props) {
  const isTemplate = 'repeat_rule' in task;
  const [showSubtasks, setShowSubtasks] = useState(false);
  const { t } = useTranslation();
  const prefix = isTemplate ? 'template' : 'task';
  const colorIndex = getPriorityColorIndex(task.priority);
  console.log('TaskItem');
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
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const animTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleUpdateTaskStatus = async () => {
    console.log('handleUpdateTaskStatus');
    try {
      setIsLoading(true);
      const newStatus = !task.is_done;
      console.log('newStatus', newStatus);
      // Обновляем статус по special_id
      await taskService.updateTaskStatus(task.id, newStatus);

      if (newStatus && task.exp && task.exp > 0) {
        setShowXPAnim(true);

        if (animTimeout.current) clearTimeout(animTimeout.current);
        animTimeout.current = setTimeout(() => {
          setShowXPAnim(false);
        }, 1000);
      }

      // await userService.fetchAndStoreCurrentUser();
    } catch (err) {
      console.error('XP update error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <li
      className={clsx(!isTemplate && task.is_done && styles.completed)}
      style={{
        display: 'flex',
        width: '100%',
      }}
    >
      <div
        className={styles.taskItem}
        style={{
          borderLeftColor: `var(--select-color-${colorIndex})`,
          paddingBottom: hasSubtasks ? 0 : undefined,
        }}
      >
        <button className={styles.wrapper} onClick={handleUpdateTaskStatus} disabled={isLoading}>
          <div className={styles.header}>
            {!isTemplate && (
              <Checkbox id={`${prefix}-${task.id}`} checked={task.is_done} disabled />
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

              {task.exp !== undefined && task.exp > 0 && (
                <div title={t('task.exp')} className={styles.xp}>
                  +{task.exp}⚡{showXPAnim && <span className={styles.xpAnim}>+{task.exp}⚡</span>}
                </div>
              )}
            </div>

            {isTemplate && (
              <Badge label={task.is_done ? t('task.status.active') : t('task.status.inactive')} />
            )}
          </div>

          <div className={styles.descriptionBlock}>
            {task.description && <div className={styles.description}>{task.description}</div>}
          </div>

          <div className={styles.metaAndTiming}>
            {(task.start_time || task.end_time) && (
              <div className={styles.timing}>
                {task.start_time && (
                  <span
                    style={{ fontSize: 'var(--font-size-secondary)' }}
                    title={t('task.timing.start')}
                  >
                    {t('task.timing.from')}{' '}
                    <span
                      style={{
                        fontWeight: 'var(--font-weight-big)',
                        fontSize: 'var(--font-size-secondary)',
                      }}
                    >
                      {formatTime(task.start_time)}
                    </span>
                  </span>
                )}
                {task.end_time && (
                  <span
                    style={{ fontSize: 'var(--font-size-secondary)' }}
                    title={t('task.timing.end')}
                  >
                    {t('task.timing.to')}{' '}
                    <span
                      style={{
                        fontWeight: 'var(--font-weight-big)',
                        fontSize: 'var(--font-size-secondary)',
                      }}
                    >
                      {formatTime(task.end_time)}
                    </span>
                  </span>
                )}
                {task.start_time && task.end_time && (
                  <span
                    style={{ fontSize: 'var(--font-size-secondary)' }}
                    title={t('task.timing.duration')}
                  >
                    {'\u00A0 '}⏳{calculateDuration(task.start_time, task.end_time)}
                    {' ' + t('time.hour') + ':' + t('time.minute')}
                  </span>
                )}
              </div>
            )}

            <div className={styles.meta}>
              {task.category && <Badge label={'# ' + task.category} title={t('task.category')} />}
              {task.priority && (
                <Badge
                  label={t(`task.priorityType.${task.priority}`)}
                  num={colorIndex}
                  title={t('task.priority')}
                />
              )}
            </div>
          </div>

          {/* {!isTemplate && task.task_date && (
          <div className={styles.date}>
            📅 {t('task.date')}: {toLocalDateString(task.task_date)}
          </div>
        )} */}

          {/* {isTemplate && (
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
        )} */}
        </button>
        {hasSubtasks && (
          <Button
            className={styles.subtaskToggleBtn}
            onClick={() => setShowSubtasks((prev) => !prev)}
            variant="secondary"
            size="small"
          >
            {showSubtasks ? '▲' : '▼'}
          </Button>
        )}
        {hasSubtasks && showSubtasks && <SubtaskList task={task} />}
      </div>
      <CustomEditBtn onClick={() => setIsEditing(true)} />
      {isEditing && (
        <TaskModal isOpen={isEditing} onClose={() => setIsEditing(false)} type="Task" task={task} />
      )}
    </li>
  );
}
