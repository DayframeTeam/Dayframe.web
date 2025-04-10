import { memo, useState, useEffect } from 'react';
import { TextInput } from '../../ui/TextInput/TextInput';
import { Task } from '../../../types/dbTypes';
import shared from '../UI/shared.module.scss';
import { TaskBasicFields } from '../UI/TaskBasicFields';
import { Button } from '../../ui/Button/Button';
import { useTranslation } from 'react-i18next';
import { TaskLocal, SubtaskLocal } from '../types';
import { nanoid } from 'nanoid';
import { SortableSubtaskList } from '../SortableSubtaskList/SortableSubtaskList';
import { ChevronDown, ChevronUp } from 'lucide-react';
import clsx from 'clsx';
import DatePicker from '../../ui/DatePicker/DatePicker';

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

  // Функция для сравнения задач
  const compareTasks = (original: Task, current: TaskLocal): boolean => {
    const cleanedCurrent = cleanupDeletedSubtasks(current);

    // Проверяем флаг удаления
    if (current.is_deleted) {
      return true;
    }

    // Сравниваем основные поля
    if (
      original.title !== cleanedCurrent.title ||
      original.description !== cleanedCurrent.description ||
      original.priority !== cleanedCurrent.priority ||
      original.category !== cleanedCurrent.category ||
      original.start_time !== cleanedCurrent.start_time ||
      original.end_time !== cleanedCurrent.end_time ||
      original.task_date !== cleanedCurrent.task_date
    ) {
      return true;
    }

    // Сравниваем подзадачи
    if (original.subtasks.length !== cleanedCurrent.subtasks.length) {
      return true;
    }

    // Сравниваем каждую подзадачу
    return cleanedCurrent.subtasks.some((subtask, index) => {
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
    handleTaskChange({ is_deleted: true });
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
      {!localTask.is_deleted && (
        <>
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

          <div
            className={clsx(shared.advancedSettings, { [shared.visible]: showAdvancedSettings })}
          >
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
        </>
      )}

      {localTask.is_deleted && (
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>{t('task.confirmDelete')}</div>
      )}

      <div className={shared.btnsWrapper} style={{ justifyContent: 'space-between' }}>
        {localTask.is_deleted ? (
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleTaskChange({ is_deleted: false })}
            >
              {t('task.cancel')}
            </Button>
            <Button type="submit" variant="primary" disabled={!hasChanges}>
              {t('confirm')}
            </Button>
          </>
        ) : (
          <>
            <Button type="button" variant="danger" onClick={handleTaskDelete}>
              {t('task.delete')}
            </Button>
            <Button type="submit" variant="primary" disabled={!hasChanges}>
              {t('task.save')}
            </Button>
          </>
        )}
      </div>
    </form>
  );
});

EditTaskForm.displayName = 'EditTaskForm';
