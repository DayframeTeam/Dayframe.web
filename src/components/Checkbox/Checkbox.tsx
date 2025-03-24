// src/components/Checkbox/Checkbox.tsx
import styles from './Checkbox.module.scss';
import { useId } from 'react';

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
};

export function Checkbox({ checked, onChange, label }: Props) {
  const id = useId();

  return (
    <label className={styles.checkbox}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className={styles.box} />
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
}
