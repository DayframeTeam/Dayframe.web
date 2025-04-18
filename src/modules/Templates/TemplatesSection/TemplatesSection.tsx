import { memo } from 'react';
import { TemplateTask } from '../../../types/dbTypes';
import { TemplateTasksSection } from '../TemplateTasksSection/TemplateTasksSection';
import { TemplatesDaysSection } from '../TemplatesDays/TemplatesDaysSection/TemplatesDaysSection';

type TemplatesSectionProps = {
  templates: TemplateTask[];
};

export const TemplatesSection = memo(({ templates }: TemplatesSectionProps) => {
  const daily: TemplateTask[] = [];
  const weekly: TemplateTask[] = [];
  const custom: TemplateTask[] = [];
  const quests: TemplateTask[] = [];

  templates.forEach((template) => {
    if (template.repeat_rule.length === 7) {
      daily.push(template);
    } else if (template.repeat_rule === 'weekly') {
      weekly.push(template);
    } else if (template.repeat_rule === 'quests') {
      quests.push(template);
    } else {
      custom.push(template);
    }
  });
  return (
    <section>
      <TemplateTasksSection type={[1, 2, 3, 4, 5, 6, 7]} templateTasks={daily} />
      <TemplateTasksSection type="weekly" templateTasks={weekly} />
      <TemplateTasksSection type={[1]} templateTasks={custom} />
      <TemplateTasksSection type="quests" templateTasks={quests} />
      <TemplatesDaysSection />
    </section>
  );
});

TemplatesSection.displayName = 'TemplatesSection';
