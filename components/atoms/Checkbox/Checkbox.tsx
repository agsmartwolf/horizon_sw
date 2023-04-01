import { generateId } from 'lib/utils/shared_functions';
import React, { useMemo } from 'react';
import cn from 'classnames';

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  checkColor?: 'black' | 'white';
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, checkColor = 'black', ...props }, ref) => {
    // TODO: Replace with useId after upgrading to react 18
    const id = useMemo(() => props.id ?? generateId(), [props.id]);

    return (
      <label htmlFor={id} className="cursor-pointer flex items-center gap-2">
        <div className="relative inline-block">
          <input
            {...props}
            checked={props.checked}
            ref={ref}
            id={id}
            type="checkbox"
            className="peer sr-only"
          />
          <div className="flex h-5 w-5 items-center justify-center rounded-md border border-input-standard transition-colors duration-400 ease-in-out peer-checked:border-primary" />
          <div
            className={cn(
              'absolute top-1 left-1 h-3 w-3 rounded-sm transition-colors duration-400 ease-in-out',
              {
                'peer-checked:bg-black': checkColor === 'black',
                'peer-checked:bg-white': checkColor === 'white',
              },
            )}
          />
        </div>
        <span className="">{label}</span>
      </label>
    );
  },
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
