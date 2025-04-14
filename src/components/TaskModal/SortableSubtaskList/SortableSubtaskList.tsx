import { memo } from 'react';
import { Button } from '../../ui/Button/Button';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableSubtaskItem from '../SortableSubtaskItem/SortableSubtaskItem';
import { useTranslation } from 'react-i18next';
import { SubtaskLocal, TaskLocal } from '../types';
import shared from '../UI/shared.module.scss';
import { nanoid } from 'nanoid';

type SortableSubtaskListProps = {
  localTask: TaskLocal;
  onSubtaskAdd: () => void;
  onSubtaskDelete: (uniqueKey: string) => void;
  onSubtaskTitleChange: (uniqueKey: string, newTitle: string) => void;
  onSubtasksReorder: (reorderedSubtasks: SubtaskLocal[]) => void;
};

export const SortableSubtaskList = memo(
  ({
    localTask,
    onSubtaskAdd,
    onSubtaskDelete,
    onSubtaskTitleChange,
    onSubtasksReorder,
  }: SortableSubtaskListProps) => {
    const { t } = useTranslation();

    const sortedSubtasks = (localTask.subtasks as SubtaskLocal[])
      .filter((s) => !s.is_deleted)
      .sort((a, b) => a.position - b.position);

    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = sortedSubtasks.findIndex((s) => s.uniqueKey === active.id);
      const newIndex = sortedSubtasks.findIndex((s) => s.uniqueKey === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      const reordered = [...sortedSubtasks];
      const [moved] = reordered.splice(oldIndex, 1);
      reordered.splice(newIndex, 0, moved);

      const updated = reordered.map((s, idx) => ({ ...s, position: idx }));
      const untouched = (localTask.subtasks as SubtaskLocal[]).filter((s) => s.is_deleted);

      onSubtasksReorder([...updated, ...untouched]);
    };

    return (
      <div className={shared.categoryWrapper} style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', margin: 0, paddingLeft: '0.5rem' }}>
            {t('task.subtasks.edit')}
          </h3>
          <Button type="button" variant="secondary" size="small" onClick={onSubtaskAdd}>
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
                key={nanoid()}
                subtask={subtask}
                onTitleChange={onSubtaskTitleChange}
                onDelete={onSubtaskDelete}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    );
  }
);

SortableSubtaskList.displayName = 'SortableSubtaskList';
