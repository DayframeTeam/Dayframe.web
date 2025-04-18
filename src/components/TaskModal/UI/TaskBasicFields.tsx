import { memo, ReactNode } from 'react';
import { TextInput } from '../../../shared/UI/TextInput/TextInput';
import { SelectInput } from '../../../shared/UI/SelectInput/SelectInput';
import { useTranslation } from 'react-i18next';
import shared from '../../../shared/UI/shared.module.scss';

type TaskBasicFieldsProps = {
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  children?: ReactNode;
  setValue: (values: Partial<Omit<TaskBasicFieldsProps, 'setValue' | 'children'>>) => void;
};

export const TaskBasicFields = memo(
  ({ title, description, priority, category, children, setValue }: TaskBasicFieldsProps) => {
    const { t } = useTranslation();
    return (
      <>
        <TextInput
          label={t('task.title') + ' ( ' + t('required') + ' )'}
          value={title ?? ''}
          onChange={(val) => setValue({ title: val })}
          required
        />
        <div style={{ margin: '0.25rem 0' }}></div>
        <TextInput
          label={t('task.description')}
          value={description ?? ''}
          onChange={(val) => setValue({ description: val })}
        />
        {children}
        <div className={shared.categoryWrapper}>
          <SelectInput
            label={t('task.priority')}
            value={priority ?? ''}
            onChange={(val) => setValue({ priority: val as 'low' | 'medium' | 'high' })}
            options={[
              { value: 'low', label: t('task.priorityType.low') },
              { value: 'medium', label: t('task.priorityType.medium') },
              { value: 'high', label: t('task.priorityType.high') },
            ]}
          />
          <div style={{ margin: '0.25rem 0' }}></div>
          <TextInput
            label={t('task.category')}
            value={category ?? ''}
            onChange={(val) => setValue({ category: val })}
          />
        </div>
      </>
    );
  }
);

TaskBasicFields.displayName = 'TaskBasicFields';
