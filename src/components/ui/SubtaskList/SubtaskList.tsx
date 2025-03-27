import styles from './SubtaskList.module.scss';
import { Subtask } from '../../../types/dbTypes';
import SubtaskItem from './SubtaskItem/SubtaskItem';

type Props = Readonly<{
  subtasks: Subtask[];
}>;

export default function SubtaskList({ subtasks }: Props) {
  return (
    <div className={styles.wrapper}>
      <ul className={styles.list}>
        {subtasks.map((subtask) => (
          <SubtaskItem key={subtask.id} subtask={subtask} />
        ))}
      </ul>
    </div>
  );
}
