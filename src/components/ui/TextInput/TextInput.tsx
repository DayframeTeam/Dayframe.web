import { ChangeEvent } from 'react';
import styles from './TextInput.module.scss';

type TextInputProps = Readonly<{
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  type?: string;
  required?: boolean;
}>;

export function TextInput({
  label,
  value,
  onChange,
  placeholder,
  id,
  type = 'text',
  required = false,
}: TextInputProps) {
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
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}
