import { useState } from 'react';
import { Modal } from '../../components/Modal/Modal';
import { TextInput } from '../../components/TextInput/TextInput';
import { SelectInput, Option } from '../../components/SelectInput/SelectInput';
import { Button } from '../../components/Button/Button';
import selectTemplates from '../../data/select_options.json';

export function AddTaskModal({ isOpen, onClose }: Readonly<{ isOpen: boolean; onClose: () => void }>) {
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [priority, setPriority] = useState('');
  const [startTime, setStartTime] = useState('');
  const [category, setCategory] = useState('');
  const [exp, setExp] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) {
      alert('Введите название задачи');
      return;
    }

    const task = {
      name,
      time,
      priority,
      startTime,
      category,
      exp,
      note,
    };

    console.log('Добавлена задача:', task);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Добавить задачу</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        <TextInput id="task-name" label="Название задачи *" value={name} onChange={setName} />
        <TextInput
          id="task-time"
          label="Время выполнения (в минутах)"
          value={time}
          onChange={setTime}
        />
        <TextInput
          id="task-start"
          label="Время начала (формат чч:мм)"
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

        <TextInput id="note" label="Заметка" value={note} onChange={setNote} />
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
