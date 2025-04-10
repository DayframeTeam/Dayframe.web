import { memo, useState, useEffect } from 'react';
import { TextInput } from '../ui/TextInput/TextInput';
import { Task } from '../../types/dbTypes';
import shared from './UI/shared.module.scss';
import { TaskBasicFields } from './UI/TaskBasicFields';
import { Button } from '../ui/Button/Button';
import { useTranslation } from 'react-i18next';
import { TaskLocal, SubtaskLocal } from './types';
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
    })) as SubtaskLocal[],
  });
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSubtaskTitleChange = (uniqueKey: string, newTitle: string) => {
    setLocalTask((prev: TaskLocal) => ({
      ...prev,
      subtasks: prev.subtasks.map((s: SubtaskLocal) =>
        s.uniqueKey === uniqueKey ? { ...s, title: newTitle } : s
      ),
    }));
  };

  const handleSubtaskDelete = (uniqueKey: string) => {
    setLocalTask((prev: TaskLocal) => ({
      ...prev,
      subtasks: prev.subtasks.map((s: SubtaskLocal) =>
        s.uniqueKey === uniqueKey ? { ...s, is_deleted: true } : s
      ),
    }));
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

  // Функция для сравнения задач
  const compareTasks = (original: Task, current: TaskLocal): boolean => {
    // Сравниваем основные поля
    if (
      original.title !== current.title ||
      original.description !== current.description ||
      original.priority !== current.priority ||
      original.category !== current.category ||
      original.start_time !== current.start_time ||
      original.end_time !== current.end_time ||
      original.task_date !== current.task_date
    ) {
      return true;
    }

    // Сравниваем подзадачи
    if (original.subtasks.length !== current.subtasks.length) {
      return true;
    }

    // Сравниваем каждую подзадачу
    return current.subtasks.some((subtask, index) => {
      const originalSubtask = original.subtasks[index];
      const localSubtask = subtask as SubtaskLocal;
      return (
        localSubtask.title !== originalSubtask.title ||
        localSubtask.is_deleted ||
        localSubtask.position !== originalSubtask.position
      );
    });
  };

  // Проверяем изменения при обновлении localTask
  useEffect(() => {
    const changed = compareTasks(task, localTask);
    setHasChanges(changed);
  }, [localTask, task]);

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
        <Button type="submit" variant="primary" disabled={!hasChanges}>
          {t('task.save')}
        </Button>
      </div>
    </form>
  );
});

EditTaskForm.displayName = 'EditTaskForm';
