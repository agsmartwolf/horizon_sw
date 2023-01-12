import React, { ReactNode } from 'react';
import { Disclosure, Transition } from '@headlessui/react';
import ChevronDown from 'assets/icons/chevron-down.svg';
import useClassNames from '../../../hooks/useClassNames';

export interface GenericAccordionProps {
  name: string;
  defaultOpen: boolean;
  children: ReactNode;
  hideArrow?: boolean;
  className?: string;
}

const GenericAccordion: React.FC<GenericAccordionProps> = ({
  name,
  defaultOpen,
  children,
  hideArrow = false,
  className = '',
}) => {
  return (
    <div>
      <Disclosure defaultOpen={defaultOpen}>
        {({ open }) => (
          <div
            className={useClassNames(
              'flex flex-col overflow-hidden',
              className,
            )}>
            <Disclosure.Button className="flex w-full items-center justify-between py-4">
              <span
                className={useClassNames('border-b border-transparent', {
                  'border-gray-400': !open,
                })}>
                {name}
              </span>
              <ChevronDown
                width={16}
                height={16}
                className={useClassNames(
                  `text-black transition-transform duration-400 ${
                    open ? 'rotate-180' : 'rotate-0'
                  }`,
                  hideArrow ? 'hidden' : '',
                )}
              />
            </Disclosure.Button>

            <Transition className="duration-400" unmount={false}>
              <Disclosure.Panel unmount={false}>
                <div
                  className="transition-[max-height] duration-400"
                  ref={ref => {
                    if (!ref) return;

                    setTimeout(() => {
                      if (open) {
                        ref.style.maxHeight = `${ref.scrollHeight}px`;
                      } else {
                        ref.style.maxHeight = `0px`;
                      }
                    }, 0);
                  }}>
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
