import { useEffect } from 'react';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/react';
import {
  Provider as ToastProvider,
  Viewport as ToastViewport,
} from '@radix-ui/react-toast';
import useNotificationStore from 'stores/notification';
import useLocaleStore from 'stores/locale';
import useCartStore from 'stores/cart';
import type { NextPageWithLayout } from 'types/shared/pages';
import '../styles/globals.css';
import '../styles/theme.css';
import { getMainLayout } from 'lib/utils/layout_getters';
import Notification from 'components/atoms/Notification';
import { setPreviewMode } from 'lib/utils/previewMode';
import { sendMessage } from 'utils/editor';
import { SettingsProvider, useCreateSettingsStore } from '../stores/settings';
import Script from 'next/script';
import * as gtag from 'lib/analytics/google';
import { GA_MEASUREMENT_ID } from 'lib/analytics/google';
import Head from 'next/head';
import PawPrintAnimation from 'components/atoms/PawILoader';
import ErrorBoundary from 'components/atoms/ErrorBoundary';
import LoaderSVG from '../components/atoms/LoaderSVG';
import useGlobalUI from '../stores/global-ui';
import useProductsStore from '../stores/products';
import {
  FBPixelProvider,
  FBPixelScript,
} from 'lib/analytics/fb/conversion-api-wrapper/src/components';

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const notifications = useNotificationStore(state => state.notifications);
  const [isLoading, setLoading] = useGlobalUI(state => [
    state.isLoading,
    state.setLoading,
  ]);
  const [locales, setActiveLocale] = useLocaleStore(state => [
    state.locales,
    state.setActiveLocale,
  ]);
  const [getCart, hideCart] = useCartStore(store => [
    store.getCart,
    store.hideCart,
  ]);
  const isProductsLoading = useProductsStore(state => state.isLoading);

  const router = useRouter();
  const { locale } = router;

  // sync the activeLocale with the router
  useEffect(() => {
    if (locale) {
      const newLocale = locales.find(myLocale => myLocale.code === locale);
      if (newLocale) {
        setActiveLocale(newLocale);
      }

      if (!isProductsLoading) {
        setLoading(false);
      }

      sendMessage({
        type: 'locale.changed',
        details: {
          locale: newLocale?.code,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, locales, setActiveLocale, isProductsLoading]);

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

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageView(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  // Default to the main layout if the page doesn't specify one
  const getLayout = Component.getLayout ?? getMainLayout;

  const C = Component as any;
  const createSettingsStore = useCreateSettingsStore(
    pageProps.initialSettingsState,
  );
  const comp = <C {...pageProps} />;

  return (
    <ErrorBoundary>
      <Head>
        <link rel="icon" href="/favicon.png" sizes="any" />
        <meta name="thumbnail" content="thumb-150x150.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="gtag-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
          `,
        }}
      />

      <ToastProvider>
        <FBPixelScript />
        <FBPixelProvider>
          <SettingsProvider createStore={createSettingsStore}>
            {getLayout(comp)}
            {isLoading ? (
              <div className="fixed top-0 left-0 w-full h-full z-modal bg-[rgb(0,0,0,0.5)] flex justify-center items-center">
                <LoaderSVG />
              </div>
            ) : null}

            <Analytics />
          </SettingsProvider>
        </FBPixelProvider>
        {notifications.map(notification => (
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
      <PawPrintAnimation />
    </ErrorBoundary>
  );
}

export default MyApp;
