import React, { Fragment, ReactNode } from 'react';
import { Popover, Transition } from '@headlessui/react';
import cn from 'classnames';
import ChevronDown from 'assets/icons/chevron-down.svg';
import ChevronUp from 'assets/icons/chevron-up.svg';

export interface GenericAccordionProps {
  name: string;
  defaultOpen: boolean;
  children: ReactNode;
  hideArrow?: boolean;
  className?: string;
}

const GenericPopover: React.FC<GenericAccordionProps> = ({
  name,
  defaultOpen,
  children,
  hideArrow = false,
  className = '',
}) => {
  return (
    <Popover
      className={cn('relative', className)}
      defaultChecked={!defaultOpen}>
      {({ open }) => (
        <>
          <Popover.Button
            className={cn(
              open ? 'text-gray-900' : 'text-gray-500',
              'group bg-white rounded-md inline-flex items-center text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 gap-2',
            )}>
            {name}
            {open ? (
              <>
                {!hideArrow ? (
                  <ChevronUp className="w-[11.5px]" aria-hidden="true" />
                ) : null}
              </>
            ) : (
              <>
                {!hideArrow ? (
                  <ChevronDown className="w-[11.5px]" aria-hidden="true" />
                ) : null}
              </>
            )}
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 -translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-1">
            <Popover.Panel className="absolute z-10 inset-x-0 transform shadow-lg">
              <div className="mt-2">{children}</div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default GenericPopover;
