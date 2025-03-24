import { useState } from 'react';
import { Modal } from '../Modal/Modal';
import { TextInput } from '../TextInput/TextInput';
import { SelectInput, Option } from '../SelectInput/SelectInput';
import { Button } from '../Button/Button';
import selectTemplates from '../../data/select_options.json';
import type { Plan } from '../../types/dbTypes';
import { useDispatch } from 'react-redux';
import { addPlan } from '../../features/plans/plansThunks';
import { AppDispatch } from '../../store';

type AddPlanModalProps = Readonly<{
  repeat_rule: Plan['repeat_rule'];
  isOpen: boolean;
  onClose: () => void;
}>;

export function AddPlanModal({ repeat_rule, isOpen, onClose }: AddPlanModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [priority, setPriority] = useState('');
  const [category, setCategory] = useState('');
  const [exp, setExp] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) {
      alert('Введите название плана');
      return;
    }

    const plan: Omit<Plan, 'id' | 'created_at' | 'user_id'> & { user_id: number } = {
      title,
      duration: duration || undefined,
      category: category as Plan['category'],
      priority: priority as Plan['priority'],
      exp: exp ? parseInt(exp) : undefined,
      description: description || undefined,
      is_active: true,
      repeat_rule,
      user_id: 1, // временно статичный
    };

    dispatch(addPlan(plan));
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Добавить план</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        <TextInput id="plan-title" label="Название плана *" value={title} onChange={setTitle} />
        <TextInput
          id="plan-duration"
          label="Длительность (чч:мм)"
          value={duration}
          onChange={setDuration}
        />

        <SelectInput
          id="priority"
          label="Приоритет"
          options={selectTemplates.priority as Option[]}
          value={priority}
          onChange={setPriority}
        />

        <SelectInput
          id="category"
          label="Категория"
          options={selectTemplates.category as Option[]}
          value={category}
          onChange={setCategory}
        />

        <SelectInput
          id="exp"
          label="Опыт за выполнение"
          options={selectTemplates.exp as Option[]}
          value={exp}
          onChange={setExp}
        />

        <TextInput id="description" label="Заметка" value={description} onChange={setDescription} />
      </div>

      <div
        style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}
      >
        <Button onClick={onClose} variant="secondary">
          Отмена
        </Button>
        <Button onClick={handleSubmit}>Добавить</Button>
      </div>
    </Modal>
  );
}
