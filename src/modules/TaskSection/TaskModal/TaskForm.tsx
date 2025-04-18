import { memo, useEffect, useState } from 'react';
import {
  DayTask,
  DayTaskSubtask,
  Subtask,
  Task,
  TemplateSubtask,
  TemplateTask,
} from '../../../types/dbTypes';
import shared from '../../../shared/UI/shared.module.scss';
import { useTranslation } from 'react-i18next';
import { TaskBasicFields } from './Fields/TaskBasicFields';
import { SelectInput } from '../../../shared/UI/SelectInput/SelectInput';
import { Button } from '../../../shared/UI/Button/Button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import clsx from 'clsx';
import { TaskTimeFields } from './Fields/TaskTimeFields';
import RepeatRuleSelector from '../../../widgets/RepeatRuleSelector/RepeatRuleSelector';
import { nanoid } from 'nanoid';
import { SortableSubtaskList } from './SortableSubtaskList/SortableSubtaskList';

type TaskFormProps = {
  task: Task | TemplateTask | DayTask;
  isEdit: boolean;
  handleSubmit: (e: React.FormEvent, task: Task | TemplateTask | DayTask) => void;
  handleDelete?: (e: React.FormEvent, task: Task | TemplateTask | DayTask) => void;
};

type AnySubtask = Subtask | TemplateSubtask | DayTaskSubtask;

// Using 'any' here to bypass complex type errors with the extended task structure.
// This is a pragmatic solution when dealing with union types that have modified subtasks
// with additional properties like is_deleted that aren't part of the original types.
// TODO: Create a proper type definition when refactoring this component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExtendedTask = any;

export const TaskForm = memo(({ task, isEdit, handleSubmit, handleDelete }: TaskFormProps) => {
  const { t } = useTranslation();

  const [localTask, setLocalTask] = useState<ExtendedTask>({
    ...task,
    subtasks: task.subtasks.map((s) => ({
      ...s,
    })),
  });
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Опции для выбора опыта (XP)
  const expOptions = [
    { label: '\u00A0 0 ⚡', value: 0 },
    { label: '\u00A0 1 ⚡', value: 1 },
    { label: '\u00A0 5 ⚡', value: 5 },
    { label: '10 ⚡', value: 10 },
    { label: '20 ⚡', value: 20 },
    { label: '50 ⚡', value: 50 },
  ];

  const cleanupDeletedSubtasks = (taskToClean: ExtendedTask): ExtendedTask => {
    return {
      ...taskToClean,
      subtasks: taskToClean.subtasks.filter((s: AnySubtask) => !(s.is_deleted && s.id === 0)),
    };
  };

  const handleSubtaskTitleChange = (special_id: string, newTitle: string) => {
    setLocalTask((prev: ExtendedTask) => ({
      ...prev,
      subtasks: prev.subtasks.map((s: AnySubtask) =>
        s.special_id === special_id ? { ...s, title: newTitle } : s
      ),
    }));
  };

  const handleSubtaskDelete = (special_id: string) => {
    setLocalTask((prev: ExtendedTask) => {
      // Сначала помечаем подзадачу как удаленную
      const withDeleted = {
        ...prev,
        subtasks: prev.subtasks.map((s: AnySubtask) =>
          s.special_id === special_id ? { ...s, is_deleted: true } : s
        ),
      };

      // Очищаем удаленные подзадачи с id === 0
      const cleaned = cleanupDeletedSubtasks(withDeleted);

      // Пересчитываем позиции для оставшихся неудаленных подзадач
      const reordered = {
        ...cleaned,
        subtasks: cleaned.subtasks
          .filter((s: AnySubtask) => !s.is_deleted)
          .map((s: AnySubtask, index: number) => ({
            ...s,
            position: index,
          }))
          .concat(cleaned.subtasks.filter((s: AnySubtask) => s.is_deleted)),
      };

      return reordered;
    });
  };

  const handleSubtaskAdd = () => {
    // Common subtask fields
    const commonFields = {
      id: 0,
      title: '',
      position: localTask.subtasks.length,
      user_id: localTask.user_id,
      created_at: '',
      is_deleted: false,
      special_id: nanoid(),
    };

    let newSubtask: AnySubtask;

    // Create the appropriate subtask type based on the parent task type
    if ('task_date' in localTask) {
      // Regular Task
      newSubtask = {
        ...commonFields,
        is_done: false,
        parent_task_id: localTask.id,
      } as Subtask;
    } else if ('repeat_rule' in localTask) {
      // Template Task
      newSubtask = {
        ...commonFields,
        template_task_id: localTask.id,
      } as TemplateSubtask;
    } else {
      // Day Task
      newSubtask = {
        ...commonFields,
        day_task_id: localTask.id,
      } as DayTaskSubtask;
    }

    setLocalTask((prev: ExtendedTask) => ({
      ...prev,
      subtasks: [...prev.subtasks, newSubtask],
    }));
  };

  const handleSubtaskReorder = (reorderedSubtasks: AnySubtask[]) => {
    setLocalTask((prev: ExtendedTask) => ({
      ...prev,
      subtasks: reorderedSubtasks,
    }));
  };

  // Функция для сравнения задач
  const compareTasks = (
    original: Task | TemplateTask | DayTask,
    current: ExtendedTask
  ): boolean => {
    // Проверяем флаг удаления
    if (isDeleted) {
      return true;
    }

    // Сравниваем основные поля
    if (
      original.title !== current.title ||
      original.description !== current.description ||
      original.priority !== current.priority ||
      original.category !== current.category ||
      original.start_time !== current.start_time ||
      original.end_time !== current.end_time ||
      ('task_date' in original &&
        'task_date' in current &&
        original.task_date !== current.task_date)
    ) {
      return true;
    }

    // Сравниваем repeat_rule отдельно, так как это может быть массив
    if ('repeat_rule' in original && 'repeat_rule' in current) {
      const originalRule = original.repeat_rule;
      const currentRule = current.repeat_rule;

      // Если типы разные (один строка, другой массив), считаем это изменением
      if (typeof originalRule !== typeof currentRule) {
        return true;
      }

      // Если оба массивы, сравниваем их содержимое
      if (Array.isArray(originalRule) && Array.isArray(currentRule)) {
        if (originalRule.length !== currentRule.length) {
          return true;
        }

        // Проверяем, содержат ли массивы одинаковые элементы
        for (const day of originalRule) {
          if (!currentRule.includes(day)) {
            return true;
          }
        }
      }
      // Если оба строки, простое сравнение
      else if (originalRule !== currentRule) {
        return true;
      }
    }

    // Сравниваем подзадачи
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nonDeletedSubtasks = current.subtasks.filter((s: any) => !s.is_deleted);
    if (original.subtasks.length !== nonDeletedSubtasks.length) {
      return true;
    }

    // Создаем массивы для сравнения с сортировкой по позиции
    const originalSorted = [...original.subtasks].sort((a, b) => a.position - b.position);
    const currentSorted = [...nonDeletedSubtasks].sort((a, b) => a.position - b.position);

    // Сравниваем подзадачи после сортировки
    for (let i = 0; i < originalSorted.length; i++) {
      const origSubtask = originalSorted[i];
      const currSubtask = currentSorted[i];

      if (
        origSubtask.title !== currSubtask.title ||
        origSubtask.position !== currSubtask.position
      ) {
        return true;
      }
    }

    return false;
  };

  // Проверяем изменения при обновлении localTask
  useEffect(() => {
    const changed = compareTasks(task, localTask);
    setHasChanges(changed);
  }, [localTask, task]);

  const baseValidation = (): boolean => {
    if (!localTask.title || localTask.title.trim() === '') {
      alert(t('task.alert.title'));
      return false;
    }
    if ('repeat_rule' in localTask && localTask.repeat_rule.length === 0) {
      alert(t('templates.alert.repeatRuleRequired'));
      return false;
    }
    return true;
  };

  const handleTaskChange = (updates: Partial<Task | TemplateTask | DayTask>) => {
    setLocalTask((prev: ExtendedTask) => ({ ...prev, ...updates }));
  };

  return (
    <form
      onSubmit={(e) => {
        if (isDeleted && handleDelete) {
          handleDelete(e, localTask);
        } else {
          if (baseValidation()) {
            handleSubmit(e, localTask);
          } else {
            e.preventDefault();
          }
        }
      }}
    >
      {isDeleted ? (
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>{t('task.confirmDelete')}</div>
      ) : (
        <>
          <TaskBasicFields
            title={localTask.title}
            description={localTask.description}
            priority={localTask.priority}
            category={localTask.category}
            setValue={(values) => handleTaskChange(values)}
          >
            <div style={{ margin: '0.25rem 0' }}></div>
            {!isEdit ? (
              <SelectInput
                label={t('task.exp')}
                options={expOptions}
                value={localTask.exp ?? 0}
                onChange={(value) => {
                  // Приводим значение к конкретному типу exp
                  const expValue = Number(value) as 0 | 1 | 5 | 10 | 20 | 50;
                  handleTaskChange({ exp: expValue });
                }}
              />
            ) : (
              <></>
            )}
          </TaskBasicFields>

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
            <TaskTimeFields localTask={localTask} handleTaskChange={handleTaskChange} />
            {'repeat_rule' in localTask && (
              <RepeatRuleSelector
                value={localTask.repeat_rule}
                selectable={true}
                onChange={(value) => handleTaskChange({ repeat_rule: value })}
              />
            )}
            {localTask.subtasks && Array.isArray(localTask.subtasks) && (
              <SortableSubtaskList
                subtasks={localTask.subtasks}
                onSubtaskAdd={handleSubtaskAdd}
                onSubtaskDelete={handleSubtaskDelete}
                onSubtaskTitleChange={handleSubtaskTitleChange}
                onSubtasksReorder={handleSubtaskReorder}
              />
            )}
          </div>
        </>
      )}

      <div
        className={shared.btnsWrapper}
        style={isEdit ? { justifyContent: 'space-between' } : { justifyContent: 'flex-end' }}
      >
        {isEdit && (
          <>
            {isDeleted ? (
              <Button type="button" variant="secondary" onClick={() => setIsDeleted(false)}>
                {t('task.cancel')}
              </Button>
            ) : (
              <Button type="button" variant="danger" onClick={() => setIsDeleted(true)}>
                {t('task.delete')}
              </Button>
            )}
          </>
        )}
        <Button type="submit" variant="primary" disabled={!hasChanges && !isDeleted}>
          {isDeleted ? t('confirm') : t('task.save')}
        </Button>
      </div>
    </form>
  );
});

TaskForm.displayName = 'TaskForm';
