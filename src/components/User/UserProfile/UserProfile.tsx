import styles from './UserProfile.module.scss';
import { LevelIndicator } from '../LevelIndicator/LevelIndicator';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useState } from 'react';
import { UserModal } from '../UserModal/UserModal';

export const UserProfile = () => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.user.user);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Если пользователь не загружен, не показываем компонент
  if (!user) return null;

  return (
    <>
      <div
        className={styles.userProfile}
        title={t('user.currentLevel')}
        onClick={() => setIsModalOpen(true)}
        role="button"
        tabIndex={0}
      >
        <LevelIndicator exp={user.exp} />
      </div>
      <UserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

UserProfile.displayName = 'UserProfile';
