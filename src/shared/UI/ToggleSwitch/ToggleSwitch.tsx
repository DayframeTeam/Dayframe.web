import { memo } from 'react';
import styles from './ToggleSwitch.module.scss';

type ToggleSwitchProps = {
  title?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
};

export const ToggleSwitch = memo(
  ({ checked, onChange, disabled = false, className = '', title = '' }: ToggleSwitchProps) => {
    return (
      <label className={`${styles.wrapper} ${className}`} title={title}>
        <input
          type="checkbox"
          className={styles.input}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <span className={styles.slider} />
      </label>
    );
  }
);

ToggleSwitch.displayName = 'ToggleSwitch';
