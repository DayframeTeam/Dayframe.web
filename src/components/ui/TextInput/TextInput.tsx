import { ChangeEvent } from 'react';
import styles from './TextInput.module.scss';

type TextInputProps = Readonly<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
}>;

export function TextInput({ label, value, onChange, placeholder, id }: TextInputProps) {
  const inputId = id || `input-${label.replace(/\s+/g, '-').toLowerCase()}`;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={styles.wrapper}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      <input
        id={inputId}
        className={styles.input}
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
      />
    </div>
  );
}
