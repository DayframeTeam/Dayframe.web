import { memo } from 'react';
import { Modal } from '../../Modal/Modal';
import { useTranslation } from 'react-i18next';
import styles from './QuestsInfoModal.module.scss';

type QuestsInfoModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const QuestsInfoModal = memo(({ isOpen, onClose }: QuestsInfoModalProps) => {
  const { t } = useTranslation();

  return (
    isOpen && (
    <Modal isOpen={isOpen} onClose={onClose} title={t('FAQ.FAQ')}>
      <div className={styles.content}>
        <div className={styles.section}>
          <h3>🎯 {t('templates.quests')}</h3>
        </div>
        <p>{t('FAQ.quests.description')}</p>
        </div>
      </Modal>
    )
  );
});

QuestsInfoModal.displayName = 'QuestsInfoModal';
