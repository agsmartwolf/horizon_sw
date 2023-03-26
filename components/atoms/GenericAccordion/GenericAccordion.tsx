import React, { ReactNode } from 'react';
import { Disclosure, Transition } from '@headlessui/react';
import ChevronDown from 'assets/icons/chevron-down.svg';
import cn from 'classnames';

export interface GenericAccordionProps {
  name: string;
  defaultOpen: boolean;
  children: ReactNode;
  hideArrow?: boolean;
  className?: string;
  arrowClassName?: string;
}

const GenericAccordion: React.FC<GenericAccordionProps> = ({
  name,
  defaultOpen,
  children,
  hideArrow = false,
  className = '',
  arrowClassName = '',
}) => {
  return (
    <div>
      <Disclosure defaultOpen={defaultOpen}>
        {({ open }) => (
          <div
            className={cn(
              'flex flex-col overflow-hidden transition-[max-height]',
              className,
            )}>
            <Disclosure.Button className="flex w-full items-center justify-between py-4">
              <div className={'relative flex items-center justify-between'}>
                <span
                  className={cn('border-b border-transparent', {
                    'border-gray-400': !open,
                  })}>
                  {name}
                </span>
                <ChevronDown
                  width={16}
                  height={16}
                  className={cn(
                    `text-black transition-transform duration-400 ${
                      open ? 'rotate-180' : 'rotate-0'
                    }`,
                    hideArrow ? 'hidden' : '',
                    arrowClassName,
                  )}
                />
              </div>
            </Disclosure.Button>

            <Transition
              className="duration-400 transition-[max-height]"
              unmount={false}>
              <Disclosure.Panel unmount={false}>
                <div
                  className={cn('transition-[max-height] duration-400', {
                    'transition-[max-height] max-h-0': !open,
                    'transition-[max-height] max-h-[1000px]': open,
                  })}>
                  {children}
                </div>
              </Disclosure.Panel>
            </Transition>
          </div>
        )}
      </Disclosure>
    </div>
  );
};

export default GenericAccordion;
