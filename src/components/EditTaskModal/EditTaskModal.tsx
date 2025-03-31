import { useTranslation } from 'react-i18next';
import { useState, useMemo } from 'react';
import { nanoid } from 'nanoid';
import { Modal } from '../../components/Modal/Modal';
import { Task, TemplateTask, RepeatRule, Subtask, TemplateSubtask } from '../../types/dbTypes';
import { Button } from '../ui/Button/Button';
import { TextInput } from '../ui/TextInput/TextInput';
import { SelectInput } from '../ui/SelectInput/SelectInput';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableSubtaskItem from './SortableSubtaskItem/SortableSubtaskItem';
import RepeatRuleSelector from '../ui/RepeatRuleSelector/RepeatRuleSelector';
import DatePicker from '../ui/DatePicker/DatePicker';

type Props = Readonly<{
  isOpen: boolean;
  onClose: () => void;
  task: Task | TemplateTask;
  onSave: (updated: Partial<Task | TemplateTask>) => void;
}>;

export type SubtaskLocal = Subtask & { is_deleted: boolean; uniqueKey: string };
export type TemplateSubtaskLocal = TemplateSubtask & { is_deleted: boolean; uniqueKey: string };

export default function TaskEditModal({ isOpen, onClose, task, onSave }: Props) {
  const { t } = useTranslation();
  const isTemplate = 'repeat_rule' in task;

  const createTaskCopy = (task: Task | TemplateTask) => ({
    ...task,
    is_deleted: false,
    subtasks: (task.subtasks || []).map((s) => ({
      ...s,
      is_deleted: false,
      uniqueKey: nanoid(),
    })) as (SubtaskLocal | TemplateSubtaskLocal)[],
  });

  const [localTask, setLocalTask] = useState(() => createTaskCopy(task));

  const sortedSubtasks = useMemo(() => {
    return localTask.subtasks.filter((s) => !s.is_deleted).sort((a, b) => a.position - b.position);
  }, [localTask.subtasks]);

  const initialTask = useMemo(() => createTaskCopy(task), [task]);
  function normalizeTask(task: typeof localTask) {
    return {
      ...task,
      subtasks: task.subtasks
        .filter((s) => !s.is_deleted)
        .map(({ uniqueKey, is_deleted, ...rest }) => rest),
    };
  }
  const isChanged = useMemo(() => {
    return JSON.stringify(normalizeTask(localTask)) !== JSON.stringify(normalizeTask(initialTask));
  }, [localTask, initialTask]);

  const handleTaskDelete = () => {
    setLocalTask((prev) => ({
      ...prev,
      is_deleted: true,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(localTask);
    //onSave(updated);
    onClose();
  };

  const handleSubtaskTitleChange = (uniqueKey: string, newTitle: string) => {
    setLocalTask((prev) => ({
      ...prev,
      subtasks: prev.subtasks.map((s) =>
        s.uniqueKey === uniqueKey ? { ...s, title: newTitle } : s
      ),
    }));
  };

  const handleSubtaskDelete = (uniqueKey: string) => {
    console.log('Удаление подзадачи:', uniqueKey);
    setLocalTask((prev) => ({
      ...prev,
      subtasks: prev.subtasks.map((s) =>
        s.uniqueKey === uniqueKey ? { ...s, is_deleted: true } : s
      ),
    }));
  };

  const handleSubtaskAdd = () => {
    const newSubtask: SubtaskLocal | TemplateSubtaskLocal = {
      id: 0,
      title: '',
      position: localTask.subtasks.length,
      special_id: nanoid(),
      user_id: localTask.user_id,
      created_at: '',
      is_deleted: false,
      uniqueKey: nanoid(),
      ...(isTemplate
        ? { template_task_id: localTask.id }
        : { parent_task_id: localTask.id, is_done: false }),
    };

    setLocalTask((prev) => ({
      ...prev,
      subtasks: [...prev.subtasks, newSubtask],
    }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setLocalTask((prev) => {
      // Фильтруем и сортируем так же, как sortedSubtasks
      const activeList = prev.subtasks
        .filter((s) => !s.is_deleted)
        .sort((a, b) => a.position - b.position);

      const oldIndex = activeList.findIndex((s) => s.uniqueKey === active.id);
      const newIndex = activeList.findIndex((s) => s.uniqueKey === over.id);
      if (oldIndex === -1 || newIndex === -1) return prev;

      // Переставляем в отсортированном списке
      const reordered = [...activeList];
      const [moved] = reordered.splice(oldIndex, 1);
      reordered.splice(newIndex, 0, moved);

      // Обновляем позиции
      const updated = reordered.map((s, idx) => ({ ...s, position: idx }));

      // Возвращаем обновлённый общий список (включая is_deleted = true)
      const untouched = prev.subtasks.filter((s) => s.is_deleted);
      return {
        ...prev,
        subtasks: [...updated, ...untouched],
      };
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('task.edit')}>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        {!localTask.is_deleted ? (
          <>
            <TextInput
              label={t('task.title')}
              value={localTask.title}
              onChange={(val) => setLocalTask({ ...localTask, title: val })}
              required
            />
            <TextInput
              label={t('task.description')}
              value={localTask.description ?? ''}
              onChange={(val) => setLocalTask({ ...localTask, description: val })}
            />
            <TextInput
              label={t('task.category')}
              value={localTask.category ?? ''}
              onChange={(val) => setLocalTask({ ...localTask, category: val })}
            />
            <SelectInput
              label={t('task.priority')}
              value={localTask.priority ?? ''}
              onChange={(val) =>
                setLocalTask({ ...localTask, priority: val as 'low' | 'medium' | 'high' })
              }
              options={[
                { value: 'low', label: t('task.priorityType.low') },
                { value: 'medium', label: t('task.priorityType.medium') },
                { value: 'high', label: t('task.priorityType.high') },
              ]}
            />
            <TextInput
              label={t('task.duration')}
              value={localTask.duration ?? ''}
              onChange={(val) => setLocalTask({ ...localTask, duration: val })}
              type="time"
            />
            <TextInput
              label={t('task.timing.start')}
              value={localTask.start_time ?? ''}
              onChange={(val) => setLocalTask({ ...localTask, start_time: val })}
              type="time"
            />
            <TextInput
              label={t('task.timing.end')}
              value={localTask.end_time ?? ''}
              onChange={(val) => setLocalTask({ ...localTask, end_time: val })}
              type="time"
            />
            {isTemplate ? (
              <RepeatRuleSelector
                value={(localTask as TemplateTask).repeat_rule}
                onChange={(newRule) =>
                  setLocalTask((prev) => ({
                    ...prev,
                    repeat_rule: newRule,
                  }))
                }
              />
            ) : (
              <DatePicker
              label={t('task.date')}
              value={(localTask as Task).task_date ? new Date((localTask as Task).task_date!) : null}
              onChange={(date) =>
                setLocalTask((prev) => ({
                  ...prev,
                  task_date: date ? date.toISOString().split('T')[0] : null,
                }))
              }
            />
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0' }}>
                <h3 style={{ margin: 0 }}>{t('task.subtasks.edit')}</h3>
                <Button type="button" variant="secondary" size="small" onClick={handleSubtaskAdd}>
                  + {t('task.subtasks.add')}
                </Button>
              </div>

              <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext
                  items={sortedSubtasks.map((s) => s.uniqueKey)}
                  strategy={verticalListSortingStrategy}
                >
                  {sortedSubtasks.map((subtask) => (
                    <SortableSubtaskItem
                      key={subtask.uniqueKey}
                      subtask={subtask}
                      onTitleChange={handleSubtaskTitleChange}
                      onDelete={handleSubtaskDelete}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
            <Button type="button" variant="danger" onClick={handleTaskDelete}>
              {t('task.delete')}
            </Button>
          </>
        ) : (
          <p>{t('task.deleted')}</p>
        )}
        <Button type="submit" disabled={!isChanged}>
          {t('task.saveChanges')}
        </Button>
      </form>
    </Modal>
  );
}
