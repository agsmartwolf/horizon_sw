import React from 'react';
// import Tick from 'assets/icons/tick.svg';
import cn from 'classnames';

interface ProductColorSelectProps {
  name: string;
  label: string;
  value: string;
  active: boolean;
  disabled?: boolean;
  onChange: (value: string) => void;
  className?: string;
}

const COLOR_MAP = new Map([
  ['red', 'bg-red-500'],
  ['green', 'bg-green-500'],
  ['blue', 'bg-blue-500'],
  ['orange', 'bg-orange-500'],
  ['yellow', 'bg-yellow-500'],
  ['purple', 'bg-purple-500'],
  ['pink', 'bg-pink-500'],
  ['brown', 'bg-brown-500'],
  ['black', 'bg-black-100'],
  ['white', 'bg-white-500'],
  ['grey', 'bg-grey-500'],
]);

const ProductColorSelect: React.FC<ProductColorSelectProps> = ({
  name,
  label,
  value,
  active,
  disabled = false,
  onChange,
}) => {
  function onOptionChanged(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value);
  }
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
      <label
        htmlFor={value}
        className={cn(
          'border-[1px] border-gray-100 p-[2.5px] w-10 h-10 cursor-pointer',
          { 'border-black': active },
        )}>
        <div
          className={cn('w-full h-full', {
            [COLOR_MAP.get(label.toLowerCase()) ?? '']: true,
          })}
        />
      </label>
    </>
  );
};

export default ProductColorSelect;
