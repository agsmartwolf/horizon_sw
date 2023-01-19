import React from 'react';
import { Transition } from '@headlessui/react';
import LinksAccordion from 'components/atoms/LinksAccordion';
import type { RootNavItem } from 'types/nav';
import { getHref } from 'lib/utils/nav';
import { denullifyArray } from 'lib/utils/denullify';
import NavLink from 'components/atoms/NavLink';
import Button from '../../atoms/Button';
import { BUTTON_STYLE, BUTTON_TYPE } from '../../../types/shared/button';

export interface MobileMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  items: RootNavItem[] | null;
  show: boolean;
  openDelay: number | undefined;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  items = [],
  show,
  openDelay,
}) => {
  return (
    <Transition
      show={show}
      aria-live="polite"
      className="absolute z-[-1] w-full bg-black p-6 transition-transform lg:hidden"
      enter={`duration-1000 ease-out ${
        openDelay ? 'delay-[700ms] lg:delay-[400ms]' : 'delay-[400ms]'
      }`}
      enterFrom="-translate-y-full"
      enterTo="translate-y-0"
      leave="delay-300 duration-[500ms] ease-in"
      leaveFrom="translate-y-0"
      leaveTo="-translate-y-full">
      <nav className="min-h-[calc(100vh-24px)] pt-20">
        <ul className="flex list-none flex-col gap-7">
          {Array.isArray(items) &&
            items.map((item, index) =>
              item.items?.length ? (
                <LinksAccordion
                  key={index}
                  title={item.name}
                  titleClassName="text-md"
                  items={denullifyArray(
                    item.items.flatMap(column => column?.items),
                  )
                    // Remove heading items from the list
                    // .filter((navItem) => navItem.type !== 'heading')
                    .map(navItem => ({
                      title: navItem.name,
                      href: getHref(navItem),
                    }))}
                />
              ) : (
                <NavLink
                  key={index}
                  label={item.name}
                  link={getHref(item)}
                  className="capitalize"
                />
              ),
            )}
          {/* TODO: Make user editable */}
          {/*<NavLink label="account" link="/account/orders" />*/}
          <Button
            elType={BUTTON_TYPE.LINK}
            href="/account/login"
            buttonStyle={BUTTON_STYLE.PRIMARY}>
            Sign in
          </Button>
        </ul>
        {/*<CurrencySelect className="mt-5" />*/}
      </nav>
    </Transition>
  );
};

export default MobileMenu;
