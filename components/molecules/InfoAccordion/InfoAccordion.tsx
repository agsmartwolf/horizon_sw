import React from 'react';
import Plus from 'assets/icons/plus.svg';
import Minus from 'assets/icons/minus.svg';
import RichText from 'components/atoms/RichText';
import cn from 'classnames';
import { Disclosure, Transition } from '@headlessui/react';

export interface InfoAccordionProps {
  label: string;
  content: string;
  accordionStyle?: 'default' | 'secondary';
  className?: string;
}

const InfoAccordion: React.FC<InfoAccordionProps> = ({
  label,
  content,
  accordionStyle = 'default',
  className,
}) => {
  const classNames = cn('flex flex-col overflow-hidden rounded-lg', '', {
    'bg-secondary': accordionStyle === 'default',
    'border border-primary px-4': accordionStyle === 'secondary',
  });
  const buttonClassNames = cn(
    'flex w-full items-center justify-between py-4',
    '',
    {
      'text-left': accordionStyle === 'secondary',
    },
  );

  return (
    <div className={className}>
      <Disclosure defaultOpen>
        {({ open }) => (
          <div className={classNames}>
            <Disclosure.Button className={buttonClassNames}>
              <span className="text-xl lg:text-2xl font-semibold">{label}</span>
              {open ? (
                <Minus width={12} height={12} className="" />
              ) : (
                <Plus width={12} height={12} className="" />
              )}
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
                  <RichText
                    className="pb-4 text-xl lg:text-2xl"
                    content={content}
                  />
                </div>
              </Disclosure.Panel>
            </Transition>
          </div>
        )}
      </Disclosure>
    </div>
  );
};

export default InfoAccordion;
