import type { Task, TemplateTask } from '../../types/dbTypes';
import { getPriorityColorIndex } from '../../utils/getPriorityColorIndex';

type Props = Readonly<{
  task: Task | TemplateTask;
}>;

export default function TaskItem({ task }: Props) {
  const isTemplate = 'repeat_rule' in task;

  const {
    title,
    description,
    category,
    priority,
    exp,
    duration,
    start_time,
    end_time,
    created_at,
  } = task;

  const colorIndex = getPriorityColorIndex(priority);
  const borderColor = `var(--select-color-${colorIndex})`;

  return (
    <li
      style={{
        background: 'var(--bg-secondary)',
        padding: '1rem',
        borderRadius: '0.75rem',
        boxShadow: '0 1px 3px var(--shadow-color)',
        borderLeft: `4px solid ${borderColor}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem',
        opacity: isTemplate
          ? task.is_active
            ? 1
            : 0.6
          : task.status
          ? 0.6
          : 1,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <strong>{title}</strong>
        {isTemplate ? (
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {task.is_active ? '🔁 Активен' : '🔕 Неактивен'}
          </span>
        ) : (
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {task.status ? '✅ Выполнено' : '📋 В процессе'}
          </span>
        )}
      </div>

      {description && (
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          {description}
        </div>
      )}

      {category && (
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Категория: {category}
        </div>
      )}

      {exp > 0 && (
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Опыт: +{exp} XP
        </div>
      )}

      {(start_time || end_time || duration) && (
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {start_time && <>Начало: {start_time} </>}
          {end_time && <>• Конец: {end_time} </>}
          {duration && <>• Длительность: {duration}</>}
        </div>
      )}

      {isTemplate && (
        <>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Повтор: {Array.isArray(task.repeat_rule)
              ? task.repeat_rule.map((d) => ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'][d]).join(', ')
              : task.repeat_rule === 'daily'
              ? 'Каждый день'
              : 'Каждую неделю'}
          </div>
          {task.start_date && (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              С: {task.start_date}
            </div>
          )}
          {task.end_date && (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              До: {task.end_date}
            </div>
          )}
        </>
      )}

      {!isTemplate && 'task_date' in task && task.task_date && (
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Дата выполнения: {task.task_date}
        </div>
      )}

      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
        Создано: {new Date(created_at).toLocaleString()}
      </div>
    </li>
  );
}
