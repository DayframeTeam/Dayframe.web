import { memo, useEffect, useState } from 'react';
import { DayTask, Task, TemplateTask } from '../../types/dbTypes';
import shared from './UI/shared.module.scss';
import { useTranslation } from 'react-i18next';
import { TaskBasicFields } from './UI/TaskBasicFields';
import { SelectInput } from '../ui/SelectInput/SelectInput';
import { Button } from '../ui/Button/Button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import clsx from 'clsx';
import { TaskTimeFields } from './UI/TaskTimeFields';
import RepeatRuleSelector from '../ui/RepeatRuleSelector/RepeatRuleSelector';

type TaskFormProps = {
  task: Task | TemplateTask | DayTask;
  isEdit: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  handleDelete?: (e: React.FormEvent) => void;
};

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
      is_deleted: false,
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
    if (original.subtasks.length !== current.subtasks.filter((s: any) => !s.is_deleted).length) {
      return true;
    }

    // Сравниваем каждую подзадачу
    let nonDeletedIndex = 0;
    for (let i = 0; i < current.subtasks.length; i++) {
      const subtask = current.subtasks[i];
      if (subtask.is_deleted) continue;

      if (nonDeletedIndex >= original.subtasks.length) return true;
      const originalSubtask = original.subtasks[nonDeletedIndex];

      if (
        subtask.title !== originalSubtask.title ||
        subtask.position !== originalSubtask.position
      ) {
        return true;
      }

      nonDeletedIndex++;
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
          handleDelete(e);
        } else {
          if (baseValidation()) {
            handleSubmit(e);
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
            {/* <SortableSubtaskList
          localTask={localTask}
          onSubtaskAdd={handleSubtaskAdd}
          onSubtaskDelete={handleSubtaskDelete}
          onSubtaskTitleChange={handleSubtaskTitleChange}
          onSubtasksReorder={handleSubtaskReorder}
        /> */}
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
