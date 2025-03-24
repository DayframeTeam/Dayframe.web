import { ReactNode, useEffect, useRef } from 'react';
import styles from './Modal.module.scss';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function Modal({ isOpen, onClose, children }: Readonly<ModalProps>) {
  const mouseDownTarget = useRef<EventTarget | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    mouseDownTarget.current = e.target;
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mouseDownTarget.current === e.target && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.backdrop} onMouseDown={handleMouseDown} onClick={handleClick}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
