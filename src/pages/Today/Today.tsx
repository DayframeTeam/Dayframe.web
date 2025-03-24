import { useState } from 'react';
import { Checkbox } from '../../components/Checkbox/Checkbox';
import { TextInput } from '../../components/TextInput/TextInput';
import { SelectInput } from '../../components/SelectInput/SelectInput';
import selectTemplates from '../../data/select_options.json';
import { Button } from '../../components/Button/Button';
import { Modal } from '../../components/Modal/Modal';
import { AddTaskModal } from '../../components/AddTaskModal/AddTaskModal';

export default function Today() {
  const [done, setDone] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [selected, setSelected] = useState('');
  const categoryOptions = selectTemplates.category.map((opt, i) => ({
    ...opt,
    color: `var(--select-color-${i + 1})`,
  }));
  const [isModalOpen, setModalOpen] = useState(false);
  return (
    <div>
      <Button onClick={() => setModalOpen(true)} variant="secondary">
        Добавить задачу +
      </Button>
      <AddTaskModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
      <SelectInput
        id="11"
        label="Категория"
        options={categoryOptions}
        value={selected}
        onChange={(val) => {
          console.log('Selected value:', val);
          setSelected(val);
        }}
      />

      <Checkbox checked={done} onChange={setDone} label="Сделать задачу" />
      <div style={{ padding: '2rem' }}>
        <TextInput
          label="Название задачи"
          value={taskName}
          onChange={setTaskName}
          placeholder="Например, Сделать отчёт"
        />
        <p style={{ marginTop: '1rem' }}>Введено: {taskName}</p>
      </div>
    </div>
  );
}
