import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput } from '../../ui/TextInput/TextInput';
import { DatePicker } from '../../ui/DatePicker/DatePicker';
import shared from './shared.module.scss';
import { DayTask, Task, TemplateTask } from '../../../types/dbTypes';
import { formatDateToLocalYYYYMMDD } from '../../../utils/dateUtils';

type TaskTimeFieldsProps = {
  localTask: Task | TemplateTask | DayTask;
  handleTaskChange: (updates: Partial<Task | TemplateTask | DayTask>) => void;
};

export const TaskTimeFields = memo(({ localTask, handleTaskChange }: TaskTimeFieldsProps) => {
  const { t } = useTranslation();

  return (
    <div className={shared.categoryWrapper}>
      <TextInput
        label={t('task.timing.start') + ' ' + t('time.hour') + '/' + t('time.minute')}
        value={localTask.start_time ?? ''}
        onChange={(val) => handleTaskChange({ start_time: val })}
        type="time"
      />
      <div style={{ margin: '0.5rem 0' }}></div>
      <TextInput
        label={t('task.timing.end') + ' ' + t('time.hour') + '/' + t('time.minute')}
        value={localTask.end_time ?? ''}
        onChange={(val) => handleTaskChange({ end_time: val })}
        type="time"
      />
      <div style={{ margin: '0.5rem 0' }}></div>
      {'task_date' in localTask && (
        <DatePicker
          value={localTask.task_date ? new Date(localTask.task_date) : null}
          label={t('task.date')}
          onChange={(date) =>
            handleTaskChange({
              task_date: date ? formatDateToLocalYYYYMMDD(date) : undefined,
            })
          }
        />
      )}
    </div>
  );
});

TaskTimeFields.displayName = 'TaskTimeFields';
