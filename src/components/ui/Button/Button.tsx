import styles from './Button.module.scss';
import { ReactNode } from 'react';
import clsx from 'clsx';

type Props = Readonly<{
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary';
  size?: 'normal' | 'small';
  className?: string;
}>;

export function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'normal',
  className,
}: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={clsx(styles.button, styles[variant], styles[size], className)}
    >
      {children}
    </button>
  );
}
