import { memo } from 'react';
import { Modal } from '../../../../shared/Modal/Modal';
import { Day } from '../../../../types/dbTypes';
import { useTranslation } from 'react-i18next';
import { DayEditModal } from './DayEditModal';
import { DayAddModal } from './DayAddModal';

type DayModalProps = {
  isOpen: boolean;
  onClose: () => void;
  day?: Day;
};

export const DayModal = memo(({ isOpen, onClose, day }: DayModalProps) => {
  const { t } = useTranslation();
  const isEdit = !!day;

  return (
    isOpen && (
      <Modal
        onClose={onClose}
        title={isEdit ? t('templates.days.edit') : t('templates.days.add')}
      >
        {isEdit ? <DayEditModal day={day} /> : <DayAddModal />}
      </Modal>
    )
  );
});

DayModal.displayName = 'DayModal';
