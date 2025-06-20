import { useId, useState, memo } from 'react';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import { ru, enUS } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';
import shared from '../../shared/UI/shared.module.scss';
import styles from './DatePicker.module.scss';
import { useTranslation } from 'react-i18next';
import { Button } from '../../shared/UI/Button/Button';

const modifiersStyles = {
  today: {
    fontWeight: 'bold',
    color: 'var(--accent-muted)',
  },
};

const focusStyles = {
  borderColor: 'none',
  userSelect: 'none',
  cursor: 'pointer',
};

type Props = {
  value: Date | undefined | null;
  label?: string;
  onChange: (date: Date | null) => void;
  placeholder?: string;
};

export const DatePicker = memo(({ value, label, onChange, placeholder }: Props) => {
  const inputId = useId();
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  const localeMap = {
    ru,
    en: enUS,
  };

  const currentLocale = localeMap[i18n.language as keyof typeof localeMap] || enUS;

  const formattedDate = value ? format(value, 'dd.MM.yyyy') : '';

  const handleSelect = (date: Date | undefined) => {
    onChange(date ?? null);
    setIsOpen(false);
  };

  const handleReset = () => {
    onChange(null);
  };

  return (
    <div className={shared.wrapper}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label htmlFor={inputId} className={shared.label + ' ' + focusStyles}>
            {label}
          </label>
          {value && (
            <Button variant='secondary' size='small' onClick={handleReset}>
              {t('ui.resetDate')}
            </Button>
          )}
        </div>
      )}
      <input
        id={inputId}
        className={shared.input}
        style={{
          userSelect: 'none',
          cursor: 'pointer',
        }}
        placeholder={placeholder}
        value={formattedDate}
        onClick={() => toggleIsOpen()}
        readOnly
      />
      {isOpen && (
        <div className={styles.wrapper}>
          <DayPicker
            mode='single'
            selected={value ?? undefined}
            onSelect={handleSelect}
            locale={currentLocale}
            modifiers={{ today: new Date() }}
            modifiersStyles={modifiersStyles}
          />
        </div>
      )}
    </div>
  );
});

DatePicker.displayName = 'DatePicker';
