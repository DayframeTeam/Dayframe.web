import styles from './Badge.module.scss';

type Props = Readonly<{
  label: string;
  priority: number;
}>;

export function Badge({ label, priority }: Props) {
  return (
    <span className={styles.badge} style={{ backgroundColor: `var(--select-color-${priority})` }}>
      {label}
    </span>
  );
}
