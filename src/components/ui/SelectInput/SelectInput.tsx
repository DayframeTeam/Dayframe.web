import { useState } from 'react';
import { Badge } from '../Badge/Badge';
import styles from './SelectInput.module.scss';

export type Option = {
  label: string;
  value: string | number;
  priority?: number; // теперь не обязательный
};

type Props = Readonly<{
  id?: string;
  label: string;
  options: Option[];
  value: string | number;
  onChange: (value: string | number) => void;
}>;

export function SelectInput({ id, label, options, value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const selected = options.find((opt) => opt.value === value);

  const inputId = id || `select-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor={inputId}>
        {label}
      </label>

      <div
        className={styles.control}
        id={inputId}
        tabIndex={0}
        onClick={() => setOpen(!open)}
        onBlur={() => setOpen(false)}
      >
        <span className={styles.value}>
          {selected ? (
            selected.priority !== undefined ? (
              <Badge label={selected.label}/>
            ) : (
              selected.label
            )
          ) : (
            'Выбери...'
          )}
        </span>

        {open && (
          <ul className={styles.dropdown}>
            {options.map((opt) => (
              <li
                key={inputId + '-' + opt.value}
                onMouseDown={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                {opt.priority !== undefined ? (
                  <Badge label={opt.label} />
                ) : (
                  opt.label
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
