import React from 'react';
import Link from 'next/link';
// import Plus from 'assets/icons/plus.svg';
// import Minus from 'assets/icons/minus.svg';
import { Disclosure, Transition } from '@headlessui/react';
import cn from 'classnames';

export interface LinksAccordionProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  items: {
    href: string;
    title: string;
  }[];
  titleClassName?: string;
  itemClassName?: string;
  panelClassname?: string;
}

const LinksAccordion: React.FC<LinksAccordionProps> = ({
  items,
  title,
  titleClassName,
  itemClassName,
  panelClassname = '',
  ...props
}) => {
  const panelClassnames = cn(
    'ml-4 transition-[max-height] duration-400',
    panelClassname,
  );
  return (
    <div {...props}>
      <Disclosure defaultOpen>
        {({ open }) => (
          <div className="flex flex-col overflow-hidden text-white">
            {title}
            {/*<Disclosure.Button className="flex w-full items-center justify-between">
            <span
              className={`font-headings text-sm font-semibold uppercase text-black ${titleClassName}`}>
              {title}
            </span>
            {open ? (
              <Minus width={12} height={12} className="text-black" />
            ) : (
              <Plus width={12} height={12} className="text-black" />
            )}
          </Disclosure.Button>*/}
            <Transition className="duration-400" unmount={false}>
              <Disclosure.Panel unmount={false}>
                <div
                  className={panelClassnames}
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
                  <ul className="flex flex-col gap-3 pt-4">
                    {items.map(item => (
                      <li key={item.title}>
                        <Link
                          href={item.href}
                          className={`text-md text-white ${itemClassName}`}>
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </Disclosure.Panel>
            </Transition>
          </div>
        )}
      </Disclosure>
    </div>
  );
};

export default LinksAccordion;
