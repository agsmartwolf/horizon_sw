import type { AppProps } from 'next/app';
import type { NextPageWithLayout } from 'types/shared/pages';
import '../styles/globals.css';
import '../styles/theme.css';

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};
function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  return <Component {...pageProps} />;
}

export default MyApp;
