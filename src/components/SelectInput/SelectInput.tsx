import { useState } from 'react';
import styles from './SelectInput.module.scss';

export type Option = {
  label: string;
  value: string;
  priority: number;
};

type Props = {
  id: string;
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
};

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
          {selected ? (
            <span
              className={styles.badge}
              style={{ backgroundColor: `var(--select-color-${selected.priority})` }}
            >
              {selected.label}
            </span>
          ) : (
            'Выбери...'
          )}
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
                <span
                  className={styles.badge}
                  style={{
                    backgroundColor: `var(--select-color-${opt.priority})`,
                  }}
                >
                  {opt.label}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
