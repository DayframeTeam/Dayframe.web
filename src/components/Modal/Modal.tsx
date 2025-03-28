import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import styles from './Modal.module.scss';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  const [mouseDownOnBackdrop, setMouseDownOnBackdrop] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  /**
   * Если пользователь нажал мышь именно на backdrop (не на дочерних элементах),
   * сохраняем флаг в стейте. При mouseup проверим, всё ли прошло на backdrop.
   */
  const handleMouseDownBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setMouseDownOnBackdrop(true);
    } else {
      setMouseDownOnBackdrop(false);
    }
  };

  /**
   * Если mouseDown был на backdrop и mouseUp тоже на backdrop, закрываем окно.
   */
  const handleMouseUpBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mouseDownOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
    setMouseDownOnBackdrop(false);
  };

  /**
   * Внутри самой модалки останавливаем всплытие mousedown/mouseup,
   * чтобы оно не срабатывало на backdrop.
   */
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return ReactDOM.createPortal(
    <div
      className={styles.backdrop}
      onMouseDown={handleMouseDownBackdrop}
      onMouseUp={handleMouseUpBackdrop}
    >
      <div className={styles.modal} onMouseDown={stopPropagation} onMouseUp={stopPropagation}>
        {title && (
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            <button className={styles.closeButton} onClick={onClose}>
              &times;
            </button>
          </div>
        )}
        <div className={styles.content}>{children}</div>
      </div>
    </div>,
    document.body
  );
};
