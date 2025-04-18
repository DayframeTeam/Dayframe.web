import styles from './Checkbox.module.scss';

type Props = Readonly<{
  id: string;
  checked: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}>;

export function Checkbox({ id, checked, onChange, label, disabled = false }: Props) {
  return (
    <label className={styles.checkbox}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={onChange ? (e) => onChange(e.target.checked) : () => {}}
      />
      <span className={styles.box} />
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
}
