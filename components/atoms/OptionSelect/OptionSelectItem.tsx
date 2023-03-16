import React from 'react';
import cn from 'classnames';
import InfoTooltip from '../InfoTooltip';

interface OptionSelectItemProps {
  name: string;
  label: string;
  value: string;
  active: boolean;
  disabled?: boolean;
  onChange: (value: string) => void;
  className?: string;
  description?: string;
}

const OptionSelectItem: React.FC<OptionSelectItemProps> = ({
  name,
  label,
  value,
  active,
  disabled = false,
  onChange,
  className,
  description,
}) => {
  function onOptionChanged(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value);
  }

  const labelClassNames = cn(
    'border text-sm transition duration-[250ms] cursor-pointer min-w-10',
    'peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-1 hover:border-black-100',
    {
      'border-black-100': !disabled,
      'border-black bg-green-100 text-black-100': active,
      'border-body bg-grey-100 text-black border-gray-300': !active,
      'border-disabled bg-grey-100 text-disabled strikethrough-diagonal border-grey-300 cursor-not-allowed':
        disabled,
      'p-[10px]': !description,
      'py-[9px] px-[15px]': !!description,
    },
    className,
  );

  const iconClassName = cn({
    'fill-gray-400': disabled,
    'stroke-gray-400': disabled,
    'stroke-black': !disabled,
    'fill-black': !disabled,
  });
  const r = (
    <div className={'flex relative overflow-visible'}>
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
      {description && (
        <div
          className={cn('absolute -right-[5px] -top-[5px] overflow-visible')}>
          <InfoTooltip text={description} iconClass={iconClassName} />
        </div>
      )}
    </div>
  );
  return r;
};

export default OptionSelectItem;
