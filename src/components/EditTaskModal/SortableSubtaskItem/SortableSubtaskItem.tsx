import styles from './SortableSubtaskItem.module.scss';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Subtask, TemplateSubtask } from '../../../types/dbTypes';
import { TextInput } from '../../ui/TextInput/TextInput';
import { Button } from '../../ui/Button/Button';
import { useTranslation } from 'react-i18next';

type Props = Readonly<{
  id: string; // Переданный уникальный ключ (id + special_id)
  subtask: Subtask | TemplateSubtask;
  index: number;
  onTitleChange: (index: number, newTitle: string) => void;
  onDelete: (index: number) => void;
}>;

export default function SortableSubtaskItem({
  id,
  subtask,
  index,
  onTitleChange,
  onDelete,
}: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const { t } = useTranslation();

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={styles.wrapper}>
      <TextInput
        value={subtask.title}
        onChange={(val) => onTitleChange(index, val)}
        placeholder={t('task.subtasks.placeholderTitle')}
      />
      <Button type="button" variant="secondary" onClick={() => onDelete(index)}>
        ✖
      </Button>
    </div>
  );
}
