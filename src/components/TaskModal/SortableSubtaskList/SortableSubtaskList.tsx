import { memo, useMemo, useState } from 'react';
import { Button } from '../../ui/Button/Button';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableSubtaskItem from '../SortableSubtaskItem/SortableSubtaskItem';
import { useTranslation } from 'react-i18next';
import { nanoid } from '@reduxjs/toolkit';
import { SubtaskLocal, TaskLocal } from '../types';
import shared from '../UI/shared.module.scss';

type SortableSubtaskListProps = {
  task: TaskLocal;
};

export const SortableSubtaskList = memo(({ task }: SortableSubtaskListProps) => {
  const { t } = useTranslation();
  const [subtasks, setSubtasks] = useState<SubtaskLocal[]>(task.subtasks as SubtaskLocal[]);

  const sortedSubtasks = useMemo(() => {
    return subtasks.filter((s) => !s.is_deleted).sort((a, b) => a.position - b.position);
  }, [subtasks]);

  const handleSubtaskTitleChange = (uniqueKey: string, newTitle: string) => {
    setSubtasks((prev) =>
      prev.map((s) => (s.uniqueKey === uniqueKey ? { ...s, title: newTitle } : s))
    );
  };

  const handleSubtaskDelete = (uniqueKey: string) => {
    setSubtasks((prev) =>
      prev.map((s) => (s.uniqueKey === uniqueKey ? { ...s, is_deleted: true } : s))
    );
  };

  const handleSubtaskAdd = () => {
    const newSubtask: SubtaskLocal = {
      id: 0,
      title: '',
      position: subtasks.length,
      special_id: nanoid(),
      user_id: task.user_id,
      created_at: '',
      is_deleted: false,
      uniqueKey: nanoid(),
      is_done: false,
      parent_task_id: task.id,
    };

    setSubtasks((prev) => [...prev, newSubtask]);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeList = subtasks
      .filter((s) => !s.is_deleted)
      .sort((a, b) => a.position - b.position);

    const oldIndex = activeList.findIndex((s) => s.uniqueKey === active.id);
    const newIndex = activeList.findIndex((s) => s.uniqueKey === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = [...activeList];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);

    const updated = reordered.map((s, idx) => ({ ...s, position: idx }));
    const untouched = subtasks.filter((s) => s.is_deleted);

    setSubtasks([...updated, ...untouched]);
  };

  return (
    <div className={shared.categoryWrapper} style={{ display: 'flex', flexDirection: 'column'}}>
      <div style={{ display: 'flex', justifyContent: 'space-between'}}>
        <h3 style={{ display: 'flex', alignItems: 'center', margin: 0, paddingLeft: '0.5rem' }}>{t('task.subtasks.edit')}</h3>
        <Button type="button" variant="primary" size="small" onClick={handleSubtaskAdd}>
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
  );
});

SortableSubtaskList.displayName = 'SortableSubtaskList';
