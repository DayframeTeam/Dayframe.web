import { memo } from 'react';
import { TemplateTasksSection } from '../TemplateTasksSection/TemplateTasksSection';
import { useAppSelector } from '../../../hooks/storeHooks';
import { TemplateTaskSelectors } from '../../../entities/template-tasks/store/templateTasksSlice';

export const TemplatesSection = memo(() => {
  const daily = useAppSelector(TemplateTaskSelectors.selectDailyTemplateTasks);
  const weekly = useAppSelector(TemplateTaskSelectors.selectWeeklyTemplateTasks);
  const custom = useAppSelector(TemplateTaskSelectors.selectCustomTemplateTasks);
  const quests = useAppSelector(TemplateTaskSelectors.selectQuestsTemplateTasks);

  return (
    <section>
      <TemplateTasksSection type={[1, 2, 3, 4, 5, 6, 7]} templateTasks={daily} />
      <TemplateTasksSection type="weekly" templateTasks={weekly} />
      <TemplateTasksSection type={[1]} templateTasks={custom} />
      <TemplateTasksSection type="quests" templateTasks={quests} />
      {/* <TemplatesDaysSection /> */}
    </section>
  );
});

TemplatesSection.displayName = 'TemplatesSection';
