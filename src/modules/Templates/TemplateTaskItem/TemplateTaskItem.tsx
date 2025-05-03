import { memo, useState } from 'react';
import styles from './TemplateTaskItem.module.scss';
import { DayTask, TemplateTask as TemplateTaskType } from '../../../types/dbTypes';
import { CustomEditBtn } from '../../../shared/UI/CustomEditBtn/CustomEditBtn';
import { Badge } from '../../../shared/UI/Badge/Badge';
import { useTranslation } from 'react-i18next';
import { getPriorityColorIndex } from '../../../utils/getPriorityColorIndex';
import { calculateDuration, formatTime } from '../../../utils/dateUtils';
import { Button } from '../../../shared/UI/Button/Button';
import { ToggleSwitch } from '../../../shared/UI/ToggleSwitch/ToggleSwitch';
import { nanoid } from 'nanoid';
import { TemplateTaskModal } from '../TemplateTaskModal/TemplateTaskModal';
import { TemplateTaskUtils } from '../../../entities/template-tasks/template.tasks.utils';
import RepeatRuleSelector from '../../../widgets/RepeatRuleSelector/RepeatRuleSelector';
import { templateTasksService } from '../../../entities/template-tasks/templateTasksService';

type TemplateTaskItemProps = {
  templateTask: TemplateTaskType | DayTask;
};

export const TemplateTaskItem = memo(({ templateTask }: TemplateTaskItemProps) => {
  const { t } = useTranslation();
  const colorIndex = getPriorityColorIndex(templateTask.priority);
  const hasSubtasks = templateTask.subtasks && templateTask.subtasks.length > 0;
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const isTaskTemplate = 'repeat_rule' in templateTask;
  if (!isTaskTemplate) {
    return null;
  }
  const rule = TemplateTaskUtils.parseRepeatRule(templateTask.repeat_rule);

  const toggleActiveTemplateTask = async () => {
    try {
      await templateTasksService.toggleActiveTemplateTask(templateTask.id, !templateTask.is_active);
    } catch (err) {
      console.error('Error toggling active template task:', err);
    }
  };
  return (
    <div className={styles.item} style={{ opacity: templateTask.is_active ? 1 : 0.5 }}>
      <div
        className={styles.info}
        style={{
          borderLeftColor: `var(--select-color-${colorIndex})`,
          paddingBottom: hasSubtasks ? 0 : undefined,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 'var(--font-weight-big)' }}>{templateTask.title}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {templateTask.exp !== undefined && templateTask.exp > 0 && (
              <div title={t('task.exp')} style={{ fontSize: 'var(--font-size-secondary)' }}>
                +{templateTask.exp}⚡
              </div>
            )}
            {isTaskTemplate && (
              <ToggleSwitch
                checked={templateTask.is_active}
                onChange={toggleActiveTemplateTask}
                title={t('templates.activeToggle')}
              />
            )}
          </div>
        </div>

        {templateTask.description && (
          <div
            style={{
              fontSize: 'var(--font-size-secondary)',
              color: 'var(--text-secondary)',
              padding: '0.5rem 0 0 0.5rem',
            }}
          >
            {templateTask.description}
          </div>
        )}
        <div className={styles.metaAndTiming}>
          {(templateTask.start_time || templateTask.end_time) && (
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
                label={t(`task.priorityType.${templateTask.priority}`)}
                num={colorIndex}
                title={t('task.priority')}
              />
            )}
          </div>
        </div>
        {isTaskTemplate && templateTask.start_active_date && (
          <div className={styles.range}>
            {t('task.repeat.from')}: {templateTask.start_active_date}
          </div>
        )}
        {isTaskTemplate && templateTask.end_active_date && (
          <div className={styles.range}>
            {t('task.repeat.to')}: {templateTask.end_active_date}
          </div>
        )}
        {isTaskTemplate && rule.length !== 7 && rule !== 'weekly' && rule !== 'quests' && (
          <RepeatRuleSelector
            value={rule}
            selectable={false}
            className={styles.repeatRuleSelector}
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
          <ul style={{ marginTop: '0', paddingInlineStart: '1rem' }}>
            {templateTask.subtasks.map((s) => (
              <li
                key={nanoid()}
                style={{ fontSize: 'var(--font-size-secondary)', marginBottom: '0.5rem' }}
              >
                {s.title}
              </li>
            ))}
          </ul>
        )}
      </div>
      <CustomEditBtn onClick={() => setIsEditing(true)} borderColor={'var(--bg-secondary)'} />
      {isTaskTemplate && (
        <TemplateTaskModal
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          task={templateTask}
        />
      )}
    </div>
  );
});

TemplateTaskItem.displayName = 'TemplateTaskItem';
