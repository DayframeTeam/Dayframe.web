import styles from './Button.module.scss';
import { ReactNode } from 'react';
import clsx from 'clsx';

type Props = Readonly<{
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary';
  className?: string;
}>;

export function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  className,
}: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={clsx(styles.button, styles[variant], className)}
    >
      {children}
    </button>
  );
}
