import React from 'react';
import { useRouter } from 'next/router';
import { Listbox } from '@headlessui/react';
import ChevronSmallIcon from 'assets/icons/chevron-down-sm.svg';
import useLocaleStore from 'stores/locale';
import type { Locale } from 'types/shared/locale';
import cn from 'classnames';
import useGlobalUI from '../../../stores/global-ui';

export interface LocaleSelectProps {
  className?: string;
  bordered?: boolean;
}

const LocaleSelect: React.FC<LocaleSelectProps> = ({
  className,
  bordered = false,
}) => {
  const [activeLocale, locales] = useLocaleStore(state => [
    state.activeLocale,
    state.locales,
  ]);

  const setLoading = useGlobalUI(state => state.setLoading);

  const router = useRouter();
  const { pathname, asPath, query } = router;

  function changeLocale(nextLocale: Locale) {
    setLoading(true);
    router.push({ pathname, query }, asPath, { locale: nextLocale.code });
  }

  if (locales?.length < 2) {
    return null;
  }

  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ''}`}>
      <Listbox value={activeLocale} onChange={changeLocale}>
        {({ open }) => (
          <div className="relative inline-block text-white">
            <Listbox.Button
              className={cn(
                `inline-flex items-center gap-2 px-4 py-2 text-md font-semibold capitalize focus:outline-none focus-visible:ring-2 focus-visible:ring-accent lg:border-transparent lg:font-medium`,
                {
                  'rounded-b-[0] bg-black lg:border-dividers': open,
                  'border border-dividers': bordered,
                },
              )}>
              {activeLocale?.name}
              <ChevronSmallIcon
                className={`w-3 transform transition ${
                  open ? '-rotate-180' : 'rotate-0'
                }`}
              />
            </Listbox.Button>
            <Listbox.Options
              className={cn(
                'absolute z-50 flex w-full flex-col gap-2 bg-black px-2 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                { 'border-x border-b border-dividers': bordered },
              )}>
              {locales?.map(locale => (
                <Listbox.Option key={locale.code} value={locale}>
                  {({ active }) => (
                    <span
                      className={`block cursor-pointer rounded-lg px-2 py-1 text-md font-semibold capitalize lg:font-medium ${
                        active ? 'bg-secondary' : ''
                      }`}>
                      {locale.name}
                    </span>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        )}
      </Listbox>
    </span>
  );
};

export default LocaleSelect;
