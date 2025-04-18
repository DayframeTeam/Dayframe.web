import styles from './Badge.module.scss';

type Props = Readonly<{
  label: string;
  num?: number;
  title?: string;
}>;

export function Badge({ label, num, title }: Props) {
  return (
    <span
      className={styles.badge}
      style={{ backgroundColor: `var(--select-color-${num || 0})` }}
      title={title}
    >
      {label}
    </span>
  );
}
