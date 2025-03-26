// src/components/Checkbox/Checkbox.tsx
import styles from './Checkbox.module.scss';

type Props = Readonly<{
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}>;

export function Checkbox({ id, checked, onChange, label }: Props) {
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
