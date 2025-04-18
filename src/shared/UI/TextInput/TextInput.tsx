import { ChangeEvent, useId } from 'react';
import shared from '../shared.module.scss';

type TextInputProps = Readonly<{
  label?: string; // label теперь опционален
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  type?: string;
  required?: boolean;
  className?: string;
}>;

export function TextInput({
  label,
  value,
  onChange,
  placeholder,
  id,
  type = 'text',
  required = false,
  className = '',
}: TextInputProps) {
  const autoId = useId();
  const inputId = id || autoId;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={shared.wrapper}>
      {label && (
        <label htmlFor={inputId} className={shared.label}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={shared.input + ' ' + className}
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}
