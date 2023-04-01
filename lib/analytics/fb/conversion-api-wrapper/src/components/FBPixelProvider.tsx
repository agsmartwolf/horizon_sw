import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { fbPageView } from '../conversion-api';

type Props = {
  children: JSX.Element;
};

const FBPixelProvider: React.FC<Props> = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    if (!router.asPath.includes('?')) {
      fbPageView();
    }

    router.events.on('routeChangeComplete', fbPageView);
    return () => {
      router.events.off('routeChangeComplete', fbPageView);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.events]);

  return children;
};

export default FBPixelProvider;
