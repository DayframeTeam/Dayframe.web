import React, { memo, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import styles from './Modal.module.scss';

type ModalProps = {
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

export const Modal = memo(({ onClose, title, children }: ModalProps) => {
  const [mouseDownOnBackdrop, setMouseDownOnBackdrop] = useState(false);
  /**
   * Если пользователь нажал мышь именно на backdrop (не на дочерних элементах),
   * сохраняем флаг в стейте. При mouseup проверим, всё ли прошло на backdrop.
   */
  const handleMouseDownBackdrop = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setMouseDownOnBackdrop(true);
    } else {
      setMouseDownOnBackdrop(false);
    }
  }, []);

  /**
   * Если mouseDown был на backdrop и mouseUp тоже на backdrop, закрываем окно.
   */
  const handleMouseUpBackdrop = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (mouseDownOnBackdrop && e.target === e.currentTarget) {
        onClose();
      }
      setMouseDownOnBackdrop(false);
    },
    [mouseDownOnBackdrop, onClose]
  );

  /**
   * Внутри самой модалки останавливаем всплытие mousedown/mouseup,
   * чтобы оно не срабатывало на backdrop.
   */
  const stopPropagation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

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
});

Modal.displayName = 'Modal';
