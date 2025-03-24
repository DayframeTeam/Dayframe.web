import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchPlans } from '../../features/plans/plansThunks';
import { TaskList } from '../../components/TaskList/TaskList';
import type { Plan } from '../../types/dbTypes';

export default function PlansPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { list, loading, error } = useSelector((state: RootState) => state.plans);

  useEffect(() => {
    if (list.length === 0) {
      dispatch(fetchPlans(1)); // только если store пустой
    }
  }, [dispatch, list.length]);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!Array.isArray(list)) return <p>Нет данных</p>;

  const priorityOrder: Record<string, number> = { low: 1, medium: 2, high: 3 };

  const sortedPlans = (repeat_rule: 'daily' | 'weekly') =>
    [...list]
      .filter((plan: Plan) => plan.repeat_rule === repeat_rule)
      .sort((a, b) => {
        const pa = priorityOrder[a.priority ?? 'low'];
        const pb = priorityOrder[b.priority ?? 'low'];
        return pb - pa;
      });

  const dailyPlans = sortedPlans('daily');
  const weeklyPlans = sortedPlans('weekly');

  return (
    <div>
      <TaskList title="Задачи на каждый день" repeat_rule="daily" tasks={dailyPlans} />
      <TaskList title="Задачи на неделю" repeat_rule="weekly" tasks={weeklyPlans} />
    </div>
  );
}
