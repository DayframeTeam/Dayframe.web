import styles from './CalendarHeader.module.scss';

type Props = Readonly<{
  monthLabel: string;
  onPrev: () => void;
  onNext: () => void;
}>;

export function CalendarHeader({ monthLabel, onPrev, onNext }: Props) {
  return (
    <div className={styles.header}>
      <button onClick={onPrev}>←</button>
      <span>{monthLabel}</span>
      <button onClick={onNext}>→</button>
    </div>
  );
}
