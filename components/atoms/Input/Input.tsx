import React from 'react';
import cn from 'classnames';
import { Icon } from '@iconify/react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  whiteBg?: boolean;
  small?: boolean;
  icon?: string;
  error?: boolean;
  inputClassname?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { whiteBg = true, small, icon, error, inputClassname = '', ...props },
    ref,
  ) => {
    const classNames = cn(
      'peer w-full px-4 text-md transition duration-300 border-[1px]',
      'focus:outline-none',
      // 'placeholder:text-input-standard',
      'placeholder:text-gray-400',
      'disabled:border-disabled disabled:text-disabled',
      {
        'border-gray-400 placeholder-shown:border-input-standard focus:border-black':
          !error,
        'border-red-600': !!error,
        'py-6': !small,
        'py-4': !!small,
        'pl-12': !!icon,
        'pr-12': !small,
        'pr-10': !!small,
        'focus:text-black': !!whiteBg,
        'focus:text-white': !whiteBg,
      },
      inputClassname,
    );

    const iconClassNames = cn(
      'absolute top-1/2 left-4 -translate-y-1/2 text-black transition duration-300 peer-focus:text-black',
    );

    return (
      <span className={`relative ${props.className ?? ''}`}>
        <input
          {...props}
          placeholder={props.placeholder || ' '}
          ref={ref}
          className={classNames}
        />
        {icon && (
          // TODO: Revise size. Should be height 16 and width 16 but the icon paths were too small.
          <Icon icon={icon} height={22} width={22} className={iconClassNames} />
        )}
      </span>
    );
  },
);

Input.displayName = 'Input';

export default Input;
