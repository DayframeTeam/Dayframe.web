import { useId, useState } from 'react';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import { ru, enUS } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';
import shared from '../shared.module.scss';
import styles from './DatePicker.module.scss';
import { useTranslation } from 'react-i18next';

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
  minDate?: Date;
  maxDate?: Date;
};

export default function DatePicker({
  value,
  label,
  onChange,
  placeholder,
  minDate,
  maxDate,
}: Props) {
  const inputId = useId();
  const { i18n } = useTranslation();
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

  return (
    <div className={shared.wrapper}>
      {label && (
        <label htmlFor={inputId} className={shared.label + ' ' + focusStyles}>
          {label}
        </label>
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
            mode="single"
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
}
