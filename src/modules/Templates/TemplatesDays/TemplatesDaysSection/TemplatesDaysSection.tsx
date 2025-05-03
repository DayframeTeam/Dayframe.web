import { PlusIcon } from 'lucide-react';
import { Button } from '../../../../shared/UI/Button/Button';
import styles from './TemplatesDaysSection.module.scss';
import { useTranslation } from 'react-i18next';
import { TemplateDay } from '../TemplateDay/TemplateDay';
import { useState } from 'react';
import { DayModal } from '../DayModal/DayModal';
import { nanoid } from 'nanoid';

export const TemplatesDaysSection = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h3 style={{ margin: '0.5rem 0', paddingLeft: 'calc(1rem + 4px)' }}>
            {t(`templates.days.title`)}
          </h3>
        </div>

        <Button size="small" variant="secondary" onClick={handleOpenModal}>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem',
              fontSize: 'var(--font-size-secondary)',
            }}
          >
            <PlusIcon />
            {t('templates.days.add')}
          </span>
        </Button>
      </div>

      {/* Display mock days */}
      <div className={styles.daysList}>
        {/* {mockDays.map((day) => (
          <TemplateDay key={nanoid()} day={day} />
        ))} */}
      </div>

      <DayModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

TemplatesDaysSection.displayName = 'TemplatesDaysSection';
