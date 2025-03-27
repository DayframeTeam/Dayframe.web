import Calendar from '../../components/Calendar/Calendar';
import { useAppSelector } from '../../hooks/storeHooks';

export default function CalendarPage() {
  const tasks = useAppSelector((state) => state.tasks);

  return <Calendar tasks={tasks} />;
}
