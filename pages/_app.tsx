import { useEffect } from 'react';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import {
  Provider as ToastProvider,
  Viewport as ToastViewport,
} from '@radix-ui/react-toast';
import useCurrencyStore from 'stores/currency';
import useNotificationStore from 'stores/notification';
import useLocaleStore from 'stores/locale';
import useCartStore from 'stores/cart';
import useSettingsStore from 'stores/settings';
import { isNotNull } from 'lib/utils/denullify';
import type { Currency } from 'types/shared/currency';
import type { NextPageWithLayout } from 'types/shared/pages';
import type { Locale } from 'types/shared/locale';
import '../styles/globals.css';
import '../styles/theme.css';
import { getMainLayout } from 'lib/utils/layout_getters';
import getGQLClient from 'lib/graphql/client';
import Notification from 'components/atoms/Notification';
import {
  generateFontSizes,
  generateFontFamilyVars,
  generateFontWeightVars,
  generateFontLinks,
} from 'build-utils/fonts.mjs';
import { EDITOR_MESSAGE_TYPE } from 'types/editor';
import { getStoreSettings } from 'lib/shop/fetchingFunctions';
import { setPreviewMode } from 'lib/utils/previewMode';

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const setCurrencies = useCurrencyStore((state) => state.setCurrencies);
  const notifications = useNotificationStore((state) => state.notifications);
  const [locales, setActiveLocale, setLocales] = useLocaleStore((state) => [
    state.locales,
    state.setActiveLocale,
    state.setLocales,
  ]);
  const [getCart, hideCart] = useCartStore((store) => [
    store.getCart,
    store.hideCart,
  ]);

  const router = useRouter();
  const { locale } = router;

  // Fetch data for global settings, currencies
  useEffect(() => {
    async function fetchStoreSettings() {
      const client = getGQLClient();
      const { data } = await client.getStoreSettings({ locale });
      const currencies = data.storeSettings?.store?.currencies;
      const locales = data.storeSettings?.store?.locales;

      const filteredCurrencies: Currency[] =
        currencies
          ?.map((currency) => {
            if (!currency?.code || !currency?.symbol) return null;
            return {
              code: currency.code,
              symbol: currency.symbol,
              name: currency.name ?? undefined,
              rate: currency.rate ?? undefined,
              decimals: currency.decimals ?? 2,
              priced: currency.priced ?? undefined,
              type: currency.type ?? undefined,
            };
          })
          .filter(isNotNull) ?? [];

      const filteredLocales: Locale[] =
        locales
          ?.map((locale) => {
            if (!locale?.code || !locale?.name) return null;
            return {
              code: locale.code,
              name: locale.name,
              fallback: locale.fallback,
            };
          })
          .filter(isNotNull) ?? [];

      setCurrencies(filteredCurrencies);
      setLocales(filteredLocales);
    }
    fetchStoreSettings();
  }, [locale, setCurrencies, setLocales]);

  // sync the activeLocale with the router
  useEffect(() => {
    if (locale) {
      const newLocale = locales.find((myLocale) => myLocale.code === locale);
      if (newLocale) setActiveLocale(newLocale);
    }
  }, [locale, locales, setActiveLocale]);

  // Hide cart on route change
  useEffect(() => {
    router.events.on('routeChangeComplete', hideCart);

    return () => {
      router.events.off('routeChangeComplete', hideCart);
    };
  }, [router, hideCart]);

  useEffect(() => {
    getCart();
  }, [getCart]);

  useEffect(() => {
    setPreviewMode(router.isPreview);
  }, [router]);

  // Default to the main layout if the page doesn't specify one
  const getLayout = Component.getLayout ?? getMainLayout;

  return (
    <>
      <ToastProvider>
        {getLayout(<Component {...pageProps} />)}
        {notifications.map((notification) => (
          <Notification
            id={notification.id}
            type={notification.type}
            message={notification.message}
            timeout={notification.timeout}
            key={notification.id}
          />
        ))}
        <ToastViewport className="fixed top-0 right-0 z-modal m-4 flex max-w-[500px] flex-col gap-2" />
      </ToastProvider>
    </>
  );
}

export default MyApp;
