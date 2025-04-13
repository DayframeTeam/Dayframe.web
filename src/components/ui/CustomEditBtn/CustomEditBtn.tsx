import { memo } from 'react';
import styles from './CustomEditBtn.module.scss';
import { PencilIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type CustomEditBtnProps = {
  borderColor?: string;
  onClick: () => void;
};

export const CustomEditBtn = memo(({ onClick, borderColor }: CustomEditBtnProps) => {
  const { t } = useTranslation();
  return (
    <button
      className={styles.btn}
      title={t('task.edit')}
      onClick={onClick}
      style={{ borderColor }}
    >
      <PencilIcon />
    </button>
  );
});

CustomEditBtn.displayName = 'CustomEditBtn';
