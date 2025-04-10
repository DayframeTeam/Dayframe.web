import { TextareaHTMLAttributes, forwardRef } from 'react';
import styles from './TextArea.module.scss'; // используем те же стили

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, ...props }, ref) => {
    return (
      <label className={styles.wrapper}>
        {label && <span className={styles.label}>{label}</span>}
        <textarea ref={ref} className={styles.input} {...props} />
      </label>
    );
  }
);

TextArea.displayName = 'TextArea';
