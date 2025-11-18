import clsx from 'clsx'; // Install with: npm install clsx

interface CheckboxProps {
  label?: string;
  checked: boolean;
  className?: string;
  id?: string;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  id,
  onChange,
  className = '',
  disabled = false,
}) => {
  return (
    <label
      className={clsx(
        'flex cursor-pointer items-center space-x-3 text-gray-800 dark:text-gray-200',
        { 'cursor-not-allowed opacity-50': disabled }
      )}
    >
      <input
        id={id}
        type="checkbox"
        className={clsx(
          'focus:ring-brand-500 h-4 w-4 rounded border-gray-300 focus:ring-2',
          'dark:checked:bg-brand-500 dark:checked:border-brand-500 dark:border-gray-600 dark:bg-gray-700',
          'focus:ring-offset-0 focus:outline-none',
          className
        )}
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        disabled={disabled}
      />
      {label && <span className="text-sm font-medium">{label}</span>}
    </label>
  );
};

export default Checkbox;
