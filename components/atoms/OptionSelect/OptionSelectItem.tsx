import React from 'react';
import cn from 'classnames';

interface OptionSelectItemProps {
  name: string;
  label: string;
  value: string;
  active: boolean;
  disabled?: boolean;
  onChange: (value: string) => void;
  className?: string;
}

const OptionSelectItem: React.FC<OptionSelectItemProps> = ({
  name,
  label,
  value,
  active,
  disabled = false,
  onChange,
  className,
}) => {
  function onOptionChanged(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value);
  }

  const labelClassNames = cn(
    'border p-[10px] text-sm transition duration-[250ms] cursor-pointer min-w-10',
    'peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-1 hover:border-black-100',
    {
      'border-black-100': !disabled,
      'border-black bg-green-100 text-black-100': active,
      'border-body bg-grey-100 text-black border-gray-300': !active,
      'border-disabled bg-grey-100 text-disabled strikethrough-diagonal border-grey-300 cursor-not-allowed':
        disabled,
    },
    className,
  );

  return (
    <>
      <input
        id={value}
        name={name}
        value={value}
        onChange={onOptionChanged}
        disabled={disabled}
        className="peer sr-only"
        type="radio"
        checked={active}
      />
      <label htmlFor={value} className={labelClassNames}>
        {label}
      </label>
    </>
  );
};

export default OptionSelectItem;
