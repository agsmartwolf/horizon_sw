import { useEffect } from 'react';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';
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

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const notifications = useNotificationStore(state => state.notifications);
  const [locales, setActiveLocale] = useLocaleStore(state => [
    state.locales,
    state.setActiveLocale,
  ]);
  const [getCart, hideCart] = useCartStore(store => [
    store.getCart,
    store.hideCart,
  ]);

  const router = useRouter();
  const { locale } = router;

  // sync the activeLocale with the router
  useEffect(() => {
    if (locale) {
      const newLocale = locales.find(myLocale => myLocale.code === locale);
      if (newLocale) setActiveLocale(newLocale);

      sendMessage({
        type: 'locale.changed',
        details: {
          locale: newLocale?.code,
        },
      });
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

  const C = Component as any;
  const comp = <C {...pageProps} />;

  return (
    <>
      <ToastProvider>
        {getLayout(comp)}
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
    </>
  );
}

export default MyApp;
