import { Button } from '../../ui/Button/Button';
import styles from './CalendarHeader.module.scss';

type Props = Readonly<{
  monthLabel: string;
  onPrev: () => void;
  onNext: () => void;
}>;

export function CalendarHeader({ monthLabel, onPrev, onNext }: Props) {
  return (
    <div className={styles.header}>
      <Button variant="secondary" size='normal' onClick={onPrev}>
        ←
      </Button>
      <span>{monthLabel}</span>
      <Button variant="secondary" size="normal" onClick={onNext}>
        →
      </Button>
    </div>
  );
}
