import styles from './Badge.module.scss';

type Props = Readonly<{
  label: string;
  num: number;
}>;

export function Badge({ label, num }: Props) {
  return (
    <span className={styles.badge} style={{ backgroundColor: `var(--select-color-${num})` }}>
      {label}
    </span>
  );
}
