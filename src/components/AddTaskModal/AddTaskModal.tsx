import { useState } from 'react';
import { Modal } from '../../components/Modal/Modal';
import { TextInput } from '../../components/TextInput/TextInput';
import { SelectInput, Option } from '../../components/SelectInput/SelectInput';
import { Button } from '../../components/Button/Button';
import selectTemplates from '../../data/select_options.json';
import { Task } from '../../types/dbTypes';
import { useDispatch } from 'react-redux';
import { addTask } from '../../features/tasks/tasksSlice';

export function AddTaskModal({
  isOpen,
  onClose,
}: Readonly<{ isOpen: boolean; onClose: () => void }>) {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [priority, setPriority] = useState('');
  const [startTime, setStartTime] = useState('');
  const [category, setCategory] = useState('');
  const [exp, setExp] = useState('');
  const [description, setDescription] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = () => {
    if (!title.trim()) {
      alert('Введите название задачи');
      return;
    }

    const task: Task = {
      title,
      duration: duration || undefined,
      priority: priority as Task['priority'],
      start_time: startTime || undefined,
      category: category as Task['category'],
      exp: exp ? (parseInt(exp) as Task['exp']) : undefined,
      description: description || undefined,
      status: 'planned',
    };

    dispatch(addTask(task));
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Добавить задачу</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        <TextInput id="task-title" label="Название задачи *" value={title} onChange={setTitle} />
        <TextInput
          id="task-duration"
          label="Длительность (чч:мм)"
          value={duration}
          onChange={setDuration}
        />
        <TextInput
          id="task-start"
          label="Время начала (чч:мм)"
          value={startTime}
          onChange={setStartTime}
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
