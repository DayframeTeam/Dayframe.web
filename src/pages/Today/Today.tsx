import { useState } from 'react';
import { Checkbox } from '../../components/Checkbox/Checkbox';
import { TextInput } from '../../components/TextInput/TextInput';
import { SelectInput } from '../../components/SelectInput/SelectInput';
import selectTemplates from '../../data/select_options.json';

export default function Today() {
  const [done, setDone] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [selected, setSelected] = useState('');
  const categoryOptions = selectTemplates.category.map((opt, i) => ({
    ...opt,
    color: `var(--select-color-${i + 1})`,
  }));
  return (
    <div>
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
