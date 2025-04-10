import { TextareaHTMLAttributes, forwardRef } from 'react';
import shared from '../shared.module.scss';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, ...props }, ref) => {
    return (
      <label className={shared.wrapper}>
        {label && <span className={shared.label}>{label}</span>}
        <textarea ref={ref} className={shared.input} {...props} />
      </label>
    );
  }
);

TextArea.displayName = 'TextArea';
