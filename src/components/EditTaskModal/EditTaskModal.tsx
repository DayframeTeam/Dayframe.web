import { useTranslation } from 'react-i18next';
import { useState, useMemo } from 'react';
import { Modal } from '../../components/Modal/Modal';
import { Task, TemplateTask, RepeatRule, Subtask, TemplateSubtask } from '../../types/dbTypes';
import { Button } from '../ui/Button/Button';
import { TextInput } from '../ui/TextInput/TextInput';
import { SelectInput } from '../ui/SelectInput/SelectInput';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import SortableSubtaskItem from './SortableSubtaskItem/SortableSubtaskItem';

type Props = Readonly<{
  isOpen: boolean;
  onClose: () => void;
  task: Task | TemplateTask;
  onSave: (updated: Partial<Task | TemplateTask>) => void;
}>;

export type SubtaskLocal = Subtask & { is_deleted: boolean };
export type TemplateSubtaskLocal = TemplateSubtask & { is_deleted: boolean };

export default function TaskEditModal({ isOpen, onClose, task, onSave }: Props) {
  const { t } = useTranslation();
  const isTemplate = 'repeat_rule' in task;

  const createTaskCopy = (task: Task | TemplateTask) => ({
    ...task,
    is_deleted: false,
    subtasks: (task.subtasks || []).map((s) => ({ ...s, is_deleted: false })) as (
      | SubtaskLocal
      | TemplateSubtaskLocal
    )[],
  });

  const [localTask, setLocalTask] = useState(createTaskCopy(task));
  const [taskDate, setTaskDate] = useState(!isTemplate ? ((task as Task).task_date ?? '') : '');
  const [repeatRule, setRepeatRule] = useState<RepeatRule>(
    isTemplate ? (task as TemplateTask).repeat_rule : 'daily'
  );
  const [taskDeleted, setTaskDeleted] = useState(false);

  const sortedSubtasks = useMemo(() => {
    return [...localTask.subtasks].sort((a, b) => a.position - b.position);
  }, [localTask.subtasks]);

  const getUniqueKey = (subtask: SubtaskLocal | TemplateSubtaskLocal) =>
    `${subtask.id}_${subtask.special_id}`;

  const handleSubtaskTitleChange = (uniqueKey: string, newTitle: string) => {
    const updated = [...localTask.subtasks];
    const index = updated.findIndex((s) => getUniqueKey(s) === uniqueKey);
    if (index === -1) return;
    updated[index] = { ...updated[index], title: newTitle };
    setLocalTask({ ...localTask, subtasks: updated });
  };

  const handleSubtaskDelete = (uniqueKey: string) => {
    const updated = [...localTask.subtasks];
    const index = updated.findIndex((s) => getUniqueKey(s) === uniqueKey);
    if (index === -1) return;

    updated[index].is_deleted = true;

    const nonDeleted = updated.filter((s) => !s.is_deleted).map((s, i) => ({ ...s, position: i }));
    const final = updated.map((s) => {
      const updatedSubtask = nonDeleted.find((x) => x.id === s.id && x.special_id === s.special_id);
      return updatedSubtask ?? s;
    });

    setLocalTask({ ...localTask, subtasks: final });
  };

  const handleSubtaskAdd = () => {
    const newSubtask: any = {
      title: '',
      position: localTask.subtasks.filter((s) => !s.is_deleted).length,
      special_id: crypto.randomUUID(),
      user_id: task.user_id,
      created_at: new Date().toISOString(),
      is_deleted: false,
    };

    if (isTemplate) {
      newSubtask.template_task_id = (task as TemplateTask).id;
    } else {
      newSubtask.parent_task_id = (task as Task).id;
      newSubtask.is_done = false;
    }

    setLocalTask({ ...localTask, subtasks: [...localTask.subtasks, newSubtask] });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);
    if (activeId === overId) return;

    const visible = localTask.subtasks.filter((s) => !s.is_deleted);
    const oldIndex = visible.findIndex((s) => getUniqueKey(s) === activeId);
    const newIndex = visible.findIndex((s) => getUniqueKey(s) === overId);
    if (oldIndex < 0 || newIndex < 0) return;

    const reordered = arrayMove(visible, oldIndex, newIndex).map((s, i) => ({ ...s, position: i }));
    const full = localTask.subtasks.map((s) => {
      const updated = reordered.find((r) => r.id === s.id && r.special_id === s.special_id);
      return updated ?? s;
    });

    setLocalTask({ ...localTask, subtasks: full });
  };

  const handleTaskDelete = () => {
    setTaskDeleted(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updated = {
      ...localTask,
      task_date: !isTemplate ? taskDate : undefined,
      repeat_rule: isTemplate ? repeatRule : undefined,
      is_deleted: taskDeleted,
    };

    console.log('[Updated Task]', updated);
    // onSave(updated);
    onClose();
  };

  const isChanged = useMemo(() => {
    const originalSubtasks = (task.subtasks || []).map((s) => ({ ...s, is_deleted: false }));
  
    const isFieldChanged = (
      localTask.title !== task.title ||
      localTask.description !== (task.description ?? '') ||
      localTask.category !== (task.category ?? '') ||
      localTask.priority !== (task.priority ?? null) ||
      localTask.duration !== (task.duration ?? '') ||
      localTask.start_time !== (task.start_time ?? '') ||
      localTask.end_time !== (task.end_time ?? '')
    );
  
    const isRepeatOrDateChanged = !isTemplate
      ? taskDate !== ((task as Task).task_date ?? '')
      : JSON.stringify(repeatRule) !== JSON.stringify((task as TemplateTask).repeat_rule);
  
    const isTaskDeletedChanged = taskDeleted;
  
    const localSubtasks = localTask.subtasks;
    if (localSubtasks.length !== originalSubtasks.length) return true;
  
    for (let i = 0; i < localSubtasks.length; i++) {
      const local = localSubtasks[i];
      const original = originalSubtasks[i];
  
      if (
        local.id !== original.id ||
        local.title !== original.title ||
        local.position !== original.position ||
        ('is_done' in local && local.is_done !== (original as Subtask).is_done) ||
        local.is_deleted !== original.is_deleted
      ) {
        return true;
      }
    }
  
    return isFieldChanged || isRepeatOrDateChanged || isTaskDeletedChanged;
  }, [localTask, task, taskDate, repeatRule, taskDeleted, isTemplate]);
  

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('task.edit')}>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        {!taskDeleted ? (
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
            {!isTemplate ? (
              <TextInput
                label={t('task.date')}
                value={taskDate}
                onChange={setTaskDate}
                type="date"
              />
            ) : (
              <SelectInput
                label={t('task.repeat.label')}
                value={Array.isArray(repeatRule) ? 'custom' : repeatRule}
                onChange={(value) =>
                  setRepeatRule(value === 'custom' ? [1, 3, 5] : (value as RepeatRule))
                }
                options={[
                  { value: 'daily', label: t('task.repeat.daily') },
                  { value: 'weekly', label: t('task.repeat.weekly') },
                  { value: 'custom', label: t('task.repeat.custom') },
                ]}
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
                  items={sortedSubtasks.map(getUniqueKey)}
                  strategy={verticalListSortingStrategy}
                >
                  {sortedSubtasks
                    .filter((subtask) => !subtask.is_deleted)
                    .map((subtask) => {
                      const uniqueKey = getUniqueKey(subtask);
                      return (
                        <SortableSubtaskItem
                          key={uniqueKey}
                          id={uniqueKey}
                          subtask={subtask}
                          onTitleChange={handleSubtaskTitleChange}
                          onDelete={handleSubtaskDelete}
                        />
                      );
                    })}
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
