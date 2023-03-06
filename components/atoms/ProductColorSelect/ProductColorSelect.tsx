import React from 'react';
// import Tick from 'assets/icons/tick.svg';
import cn from 'classnames';
import styles from './ProductColorSelect.module.css';

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
  ['brown', 'bg-amber-900'],
  ['black', 'bg-black-100'],
  ['white', 'bg-white-500'],
  ['grey', 'bg-gray-400'],

  ['gray', 'bg-gray-400'],

  ['orange/black', 'bg-gradient-to-r from-orange-500 to-black-100'],
  ['army green', 'bg-armygreen'],
  ['vibrant orange', 'bg-vibrantorange'],
  ['pool blue', 'bg-poolblue'],
  ['ribbon red', 'bg-ribbonred'],
  ['orangeade', 'bg-orangeade'],
  ['baltic', 'bg-baltic'],
  ['neon yellow', 'bg-neonyellow'],
  ['fuchsia', 'bg-fuchsia'],
  ['royal blue', 'bg-royalblue'],
  ['grass green', 'bg-grassgreen'],
  ['funchsia', 'bg-funchsia'],
  ['grey/orange', 'bg-gradient-to-r from-gray-400 to-orange-200'],
  ['grey/yellow', 'bg-gradient-to-r from-gray-400 to-yellow-200'],
  ['grey/neon yellow', 'bg-gradient-to-r from-gray-400 to-yellow-200'],
  ['black/orange', 'bg-gradient-to-r from-orange-500 to-black-100'],
  ['black/neon yellow', 'bg-gradient-to-r from-black-100 to-yellow-100'],
  ['glacier gray', 'bg-glaciergray'],
  ['bright white', 'bg-brightwhite'],
  ['blue radiance', 'bg-blueradiance'],
  ['calypso coral', 'bg-calypsocoral'],
  ['blue topaz', 'bg-bluetopaz'],
  ['blazing yellow', 'bg-blazingyellow'],
  ['hot coral', 'bg-hotcoral'],
  ['black ink', 'bg-blackink'],
  ['turquoise', 'bg-turquoise'],
  ['rosso', 'bg-rosso'],
  ['carrot', 'bg-carrot'],
  ['artic', 'bg-artic'],
  ['chocolate', 'bg-chocolate'],
  ['gold', 'bg-gold'],
  ['steel', 'bg-steel'],
  ['violet', 'bg-violet'],
  ['wine', 'bg-wine'],
  ['multicolor', 'bg-gradient-to-r from-blue-400 to-red-500'],
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
          'border-[1px] p-[2.5px] w-10 h-10 min-w-10 cursor-pointer',
          { 'border-black': active },
          { 'border-gray-100': !active },
          { 'opacity-20 strikethrough-diagonal cursor-not-allowed': disabled },
          { [styles.disabled]: disabled },
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
