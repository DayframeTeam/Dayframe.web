import { memo, useState } from 'react';
import { TextInput } from '../ui/TextInput/TextInput';
import { Task } from '../../types/dbTypes';
import shared from './UI/shared.module.scss';
import { TaskBasicFields } from './UI/TaskBasicFields';
import { Button } from '../ui/Button/Button';
import { useTranslation } from 'react-i18next';
import { formatDateToISO } from '../../utils/dateUtils';
import { TaskLocal } from './types';
import { nanoid } from 'nanoid';
import { SortableSubtaskList } from './SortableSubtaskList/SortableSubtaskList';
import { ChevronDown, ChevronUp } from 'lucide-react';
import clsx from 'clsx';
import DatePicker from '../ui/DatePicker/DatePicker';

type EditTaskFormProps = {
  task: Task;
};

export const EditTaskForm = memo(({ task }: EditTaskFormProps) => {
  const { t } = useTranslation();
  const [localTask, setLocalTask] = useState<TaskLocal>({
    ...task,
    is_deleted: false,
    subtasks: task.subtasks.map((s) => ({
      ...s,
      is_deleted: false,
      uniqueKey: nanoid(),
    })),
  });
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  const handleTaskDelete = () => {
    const updatedTask = {
      ...localTask,
      is_deleted: true,
    };
    setLocalTask(updatedTask);
  };

  const handleTaskChange = (updates: Partial<TaskLocal>) => {
    const updatedTask = { ...localTask, ...updates };
    setLocalTask(updatedTask);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Здесь будет логика отправки формы
    console.log('Form submitted:', localTask);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TaskBasicFields
        title={localTask.title}
        description={localTask.description}
        priority={localTask.priority}
        category={localTask.category}
        setValue={(values) => handleTaskChange(values)}
      />

      <Button
        type="button"
        variant="secondary"
        onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
        className={shared.toggleButton}
      >
        {showAdvancedSettings ? t('task.hideAdvanced') : t('task.showAdvanced')}
        {showAdvancedSettings ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </Button>

      <div className={clsx(shared.advancedSettings, { [shared.visible]: showAdvancedSettings })}>
        <div className={shared.categoryWrapper}>
          <TextInput
            label={t('task.timing.start')}
            value={localTask.start_time ?? ''}
            onChange={(val) => handleTaskChange({ start_time: val })}
            type="time"
          />
          <div style={{ margin: '0.5rem 0' }}></div>
          <TextInput
            label={t('task.timing.end')}
            value={localTask.end_time ?? ''}
            onChange={(val) => handleTaskChange({ end_time: val })}
            type="time"
          />
          <div style={{ margin: '0.5rem 0' }}></div>
          <DatePicker
            value={localTask.task_date ? new Date(localTask.task_date) : null}
            label={t('task.date')}
            onChange={(date) =>
              handleTaskChange({
                task_date: date
                  ? formatDateToISO(date.getFullYear(), date.getMonth(), date.getDate())
                  : undefined,
              })
            }
          />
        </div>

        <SortableSubtaskList task={localTask} />
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '1rem',
        }}
      >
        <Button type="button" variant="danger" onClick={handleTaskDelete}>
          {t('task.delete')}
        </Button>
        <Button type="submit" variant="primary">
          {t('task.save')}
        </Button>
      </div>
    </form>
  );
});

EditTaskForm.displayName = 'EditTaskForm';
