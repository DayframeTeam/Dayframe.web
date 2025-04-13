import { memo, useState } from 'react';
import styles from './TemplateTaskItem.module.scss';
import { TemplateTask as TemplateTaskType } from '../../../types/dbTypes';
import { CustomEditBtn } from '../../ui/CustomEditBtn/CustomEditBtn';
import { Badge } from '../../ui/Badge/Badge';
import { useTranslation } from 'react-i18next';
import { getPriorityColorIndex } from '../../../utils/getPriorityColorIndex';
import { calculateDuration, formatTime } from '../../../utils/dateUtils';
import { Button } from '../../ui/Button/Button';
import { ToggleSwitch } from '../../ui/ToggleSwitch/ToggleSwitch';
import { SelectedDays } from '../../ui/SeleectedDays/SeleectedDays';

type TemplateTaskItemProps = {
  templateTask: TemplateTaskType;
};

export const TemplateTaskItem = memo(({ templateTask }: TemplateTaskItemProps) => {
  const { t } = useTranslation();
  const colorIndex = getPriorityColorIndex(templateTask.priority);
  const hasSubtasks = templateTask.subtasks && templateTask.subtasks.length > 0;
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [isActive, setIsActive] = useState(!templateTask.is_done);

  return (
    <div className={styles.item} style={{ opacity: isActive ? 1 : 0.5 }}>
      <div
        className={styles.info}
        style={{
          borderLeftColor: `var(--select-color-${colorIndex})`,
          paddingBottom: hasSubtasks ? 0 : undefined,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 'var(--font-weight-big)' }}>{templateTask.title}</span>
          {templateTask.exp > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div title={t('task.exp')} style={{ fontSize: 'var(--font-size-secondary)' }}>
                +{templateTask.exp}⚡
              </div>
              <ToggleSwitch
                checked={isActive}
                onChange={() => setIsActive(!isActive)}
                title={t('templates.activeToggle')}
              />
            </div>
          )}
        </div>

        <div
          style={{
            fontSize: 'var(--font-size-secondary)',
            color: 'var(--text-secondary)',
            padding: '0.5rem 0 0 0.5rem',
          }}
        >
          {templateTask.description}
        </div>
        <div className={styles.metaAndTiming}>
          {(templateTask.start_time || templateTask.end_time || templateTask.duration) && (
            <div className={styles.timing}>
              {templateTask.start_time && (
                <span title={t('task.timing.start')}>
                  {t('task.timing.from')}{' '}
                  <span style={{ fontWeight: 'var(--font-weight-big)' }}>
                    {formatTime(templateTask.start_time)}
                  </span>
                </span>
              )}
              {templateTask.end_time && (
                <span title={t('task.timing.end')}>
                  {t('task.timing.to')}{' '}
                  <span style={{ fontWeight: 'var(--font-weight-big)' }}>
                    {formatTime(templateTask.end_time)}
                  </span>
                </span>
              )}
              {templateTask.start_time && templateTask.end_time && (
                <span title={t('task.timing.duration')}>
                  ⏳ {calculateDuration(templateTask.start_time, templateTask.end_time)}
                  {' ' + t('time.hour') + ':' + t('time.minute')}
                </span>
              )}
            </div>
          )}

          <div className={styles.meta}>
            {templateTask.category && (
              <Badge label={'# ' + templateTask.category} title={t('task.category')} />
            )}
            {templateTask.priority && (
              <Badge
                label={'🎯 ' + t(`task.priorityType.${templateTask.priority}`)}
                num={colorIndex}
                title={t('task.priority')}
              />
            )}
          </div>
        </div>
        {templateTask.start_date && (
          <div className={styles.range}>
            {t('task.repeat.from')}: {templateTask.start_date}
          </div>
        )}
        {templateTask.end_date && (
          <div className={styles.range}>
            {t('task.repeat.to')}: {templateTask.end_date}
          </div>
        )}
        {templateTask.repeat_rule !== 'daily' &&
          templateTask.repeat_rule !== 'weekly' &&
          templateTask.repeat_rule !== 'quests' && (
            <SelectedDays
              className={styles.repeatDays}
              selectedDays={templateTask.repeat_rule}
              selectable={false}
            />
          )}
        {hasSubtasks && (
          <Button
            className={styles.templatesubtaskToggle}
            onClick={() => setShowSubtasks((prev) => !prev)}
            variant="secondary"
            size="small"
          >
            {showSubtasks ? '▲' : '▼'}
          </Button>
        )}
        {hasSubtasks && showSubtasks && (
          <ul style={{ marginTop: '0' }}>
            {templateTask.subtasks.map((s) => (
              <li
                key={s.id}
                style={{ fontSize: 'var(--font-size-secondary)', marginBottom: '0.5rem' }}
              >
                {s.title}
              </li>
            ))}
          </ul>
        )}
      </div>
      <CustomEditBtn onClick={() => {}} borderColor={'var(--bg-primary)'} />
    </div>
  );
});

TemplateTaskItem.displayName = 'TemplateTaskItem';
