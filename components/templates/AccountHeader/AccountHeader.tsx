import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';
import ArrowLeft from 'assets/icons/arrow-left.svg';
import Link from 'next/link';
import AccountMobileMenu from 'components/organisms/AccountMobileMenu';
import type { AccountNavLinkProps } from 'components/atoms/AccountNavLink';
import AccountDetails, {
  AccountDetailsProps,
} from 'components/atoms/AccountDetails';
import useI18n from 'hooks/useI18n';
import type { LogoProps } from 'components/atoms/Logo';
import Logo from 'components/atoms/Logo';
import LocaleSelect from 'components/atoms/LocaleSelect';

import styles from './accountHeader.module.css';

export interface AccountHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  hideOnScroll: boolean;
  logoSettings: LogoProps;
  mobileMenuLinks?: AccountNavLinkProps[];
  pageTitle?: string;
  accountDetails?: AccountDetailsProps;
}

const AccountHeader: React.FC<AccountHeaderProps> = ({
  hideOnScroll,
  logoSettings,
  pageTitle,
  mobileMenuLinks,
  accountDetails,
}) => {
  const [shouldHide, setShouldHide] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const router = useRouter();
  const i18n = useI18n();

  const backToShopLabel = i18n('navigation.account_return_home');

  const classNames = cn(
    'sticky top-0 left-0 z-header w-full font-headings bg-black transform transition-transform duration-500 ease-in-out',
    {
      '-translate-y-full': shouldHide && !showMobileMenu,
      'shadow-3xl md:shadow-none': !!(pageTitle && mobileMenuLinks),
    },
  );

  useEffect(() => {
    const SCROLL_OFFSET = 200;
    let prevScrollY = 0;

    function handleScroll() {
      const { scrollY } = window;
      if (Math.abs(scrollY - prevScrollY) < SCROLL_OFFSET) return;
      window.requestAnimationFrame(() => {
        setShouldHide(scrollY > prevScrollY);
        prevScrollY = scrollY;
      });
    }

    if (hideOnScroll) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      if (hideOnScroll) {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [hideOnScroll]);

  useEffect(() => {
    const callback = () => {
      setShowMobileMenu(false);
    };
    router.events.on('routeChangeComplete', callback);

    return () => {
      router.events.off('routeChangeComplete', callback);
    };
  }, [router.events, setShowMobileMenu]);

  return (
    <>
      <header className={classNames}>
        <div className="grid grid-cols-3 items-center border-b border-dividers py-[1.125rem]">
          <div className="md:ml-6 lg:ml-14">
            <Link
              href="/"
              className="hidden sm:flex col-span-1 items-center gap-2 md:flex">
              <ArrowLeft
                width={16}
                height={16}
                className={`text-white stroke-white ${styles.arrowBackHeader}`}
              />
              <span className="text-sm font-semibold text-white">
                {backToShopLabel}
              </span>
            </Link>
          </div>
          <Link
            href="/"
            className="col-span-4 sm:col-span-1 flex items-center justify-center text-center">
            <Logo {...logoSettings} />
            {/*<Image
              src={logo.src}
              width={logo.width}
              height={logo.height}
              alt={logo.alt}
            />*/}
          </Link>
          <div className="hidden sm:flex sm:col-span-1 items-center justify-end text-center md:mr-6 lg:mr-14">
            <LocaleSelect />
          </div>
        </div>
        {accountDetails && (
          <div className="px-6 pt-4 pb-6 md:hidden">
            <AccountDetails {...accountDetails} />
          </div>
        )}
        {!!pageTitle && !!mobileMenuLinks && (
          // TODO: Make MobileMenu visibility be controlled by showMobileMenu state
          <AccountMobileMenu label={pageTitle} links={mobileMenuLinks} />
        )}
        <div className="sm:hidden w-full bg-black items-start justify-start md:mr-6 lg:mr-14 py-2 px-4">
          <LocaleSelect />
        </div>
      </header>
    </>
  );
};

export default AccountHeader;
