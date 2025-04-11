import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../../ui/Button/Button';
import { TaskBasicFields } from '../UI/TaskBasicFields';
import { TextInput } from '../../ui/TextInput/TextInput';
import { DatePicker } from '../../ui/DatePicker/DatePicker';
import { SortableSubtaskList } from '../SortableSubtaskList/SortableSubtaskList';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { memo, useState } from 'react';
import shared from '../UI/shared.module.scss';
import { SubtaskLocal, TaskLocal } from '../types';
import { nanoid } from '@reduxjs/toolkit';
import { SelectInput } from '../../ui/SelectInput/SelectInput';

export const AddTaskForm = memo(({ date }: { date?: string }) => {
  const { t } = useTranslation();
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  const [localTask, setLocalTask] = useState<TaskLocal>({
    id: 0,
    title: '',
    description: undefined,
    category: undefined,
    priority: undefined,
    exp: 0,
    duration: undefined,
    start_time: undefined,
    end_time: undefined,
    user_id: 0,
    created_at: new Date().toISOString(),
    is_done: false,
    special_id: nanoid(),
    task_date: date ?? undefined,
    subtasks: [] as SubtaskLocal[],
    is_deleted: false,
  });

  // Опции для выбора опыта (XP)
  const expOptions = [
    { label: '\u00A0 0 ⚡', value: 0 },
    { label: '\u00A0 1 ⚡', value: 1 },
    { label: '\u00A0 5 ⚡', value: 5 },
    { label: '10 ⚡', value: 10 },
    { label: '20 ⚡', value: 20 },
    { label: '50 ⚡', value: 50 },
  ];

  const cleanupDeletedSubtasks = (taskToClean: TaskLocal): TaskLocal => {
    return {
      ...taskToClean,
      subtasks: taskToClean.subtasks.filter((s: SubtaskLocal) => !(s.is_deleted && s.id === 0)),
    };
  };

  const handleSubtaskTitleChange = (uniqueKey: string, newTitle: string) => {
    setLocalTask((prev: TaskLocal) => ({
      ...prev,
      subtasks: prev.subtasks.map((s: SubtaskLocal) =>
        s.uniqueKey === uniqueKey ? { ...s, title: newTitle } : s
      ),
    }));
  };

  const handleSubtaskDelete = (uniqueKey: string) => {
    setLocalTask((prev: TaskLocal) => {
      // Сначала помечаем подзадачу как удаленную
      const withDeleted = {
        ...prev,
        subtasks: prev.subtasks.map((s: SubtaskLocal) =>
          s.uniqueKey === uniqueKey ? { ...s, is_deleted: true } : s
        ),
      };

      // Очищаем удаленные подзадачи с id === 0
      const cleaned = cleanupDeletedSubtasks(withDeleted);

      // Пересчитываем позиции для оставшихся неудаленных подзадач
      const reordered = {
        ...cleaned,
        subtasks: cleaned.subtasks
          .filter((s: SubtaskLocal) => !s.is_deleted)
          .map((s: SubtaskLocal, index: number) => ({
            ...s,
            position: index,
          }))
          .concat(cleaned.subtasks.filter((s: SubtaskLocal) => s.is_deleted)),
      };

      return reordered;
    });
  };

  const handleSubtaskAdd = () => {
    const newSubtask: SubtaskLocal = {
      id: 0,
      title: '',
      position: localTask.subtasks.length,
      special_id: nanoid(),
      user_id: localTask.user_id,
      created_at: '',
      is_deleted: false,
      uniqueKey: nanoid(),
      is_done: false,
      parent_task_id: localTask.id,
    };

    setLocalTask((prev: TaskLocal) => ({
      ...prev,
      subtasks: [...prev.subtasks, newSubtask],
    }));
  };

  const handleSubtaskReorder = (reorderedSubtasks: SubtaskLocal[]) => {
    setLocalTask((prev: TaskLocal) => ({
      ...prev,
      subtasks: reorderedSubtasks,
    }));
  };

  const handleTaskChange = (updates: Partial<TaskLocal>) => {
    const updatedTask = { ...localTask, ...updates };
    setLocalTask(updatedTask);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add task submission logic here
    console.log('Adding task:', localTask);
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
        <SelectInput
          label={t('task.exp')}
          options={expOptions}
          value={localTask.exp}
          onChange={(value) => {
            // Приводим значение к конкретному типу exp
            const expValue = Number(value) as 0 | 1 | 5 | 10 | 20 | 50;
            handleTaskChange({ exp: expValue });
          }}
        />
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
          <DatePicker
            value={localTask.task_date ? new Date(localTask.task_date) : undefined}
            label={t('task.date')}
            onChange={(date) =>
              handleTaskChange({
                task_date: date ? date.toISOString() : undefined,
              })
            }
          />
        </div>
        <SortableSubtaskList
          localTask={localTask}
          onSubtaskAdd={handleSubtaskAdd}
          onSubtaskDelete={handleSubtaskDelete}
          onSubtaskTitleChange={handleSubtaskTitleChange}
          onSubtasksReorder={handleSubtaskReorder}
        />
      </div>

      <div className={shared.btnsWrapper} style={{ justifyContent: 'flex-end' }}>
        <Button type="submit" variant="primary" disabled={!localTask.title}>
          {t('task.save')}
        </Button>
      </div>
    </form>
  );
});

AddTaskForm.displayName = 'AddTaskForm';
