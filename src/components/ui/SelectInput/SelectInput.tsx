import { useState } from 'react';
import { Badge } from '../Badge/Badge'; // путь проверь
import styles from './SelectInput.module.scss';

export type Option = {
  label: string;
  value: string;
  priority: number;
};

type Props = Readonly<{
  id: string;
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}>;

export function SelectInput({ id, label, options, value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const selected = options.find((opt) => opt.value === value);

  return (
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>

      <div
        className={styles.control}
        id={id}
        tabIndex={0}
        onClick={() => setOpen(!open)}
        onBlur={() => setOpen(false)}
      >
        <span className={styles.value}>
          {selected ? <Badge label={selected.label} priority={selected.priority} /> : 'Выбери...'}
        </span>

        {open && (
          <ul className={styles.dropdown}>
            {options.map((opt) => (
              <li
                key={id + opt.value}
                onMouseDown={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                <Badge label={opt.label} priority={opt.priority} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
