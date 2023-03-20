// import { useMediaQuery } from '@react-hook/media-query';
import { useEffect, useLayoutEffect, useState } from 'react';

const getMatches = (query: string): boolean => {
  // Prevents SSR issues
  if (typeof window !== 'undefined') {
    return window.matchMedia(query).matches;
  }
  return false;
};

/**
 * Returns true if the given media query matches.
 * Returns undefined until the first render occured to prevent hydration errors.
 * @param query A media query as string
 * @returns
 */
export function useMediaQuery(query: string): boolean | undefined {
  const [hasMatch, setHasMatches] = useState<boolean>(getMatches(query));
  const [initialLoad, setInitialLoad] = useState(true);

  useLayoutEffect(() => {
    if (initialLoad) {
      setInitialLoad(false);
    }
    // eslint-disable-next-line
  }, []);

  function handleChange() {
    setHasMatches(getMatches(query));
  }

  useEffect(() => {
    const matchMedia = window.matchMedia(query);
    handleChange();
    matchMedia.addEventListener('change', handleChange);
    return () => {
      matchMedia.removeEventListener('change', handleChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return initialLoad ? undefined : hasMatch;
}

export function useViewport() {
  const isMobile = useMediaQuery('(min-width: 1px) and (max-width: 639px)');
  const isTablet = useMediaQuery('(min-width: 640px) and (max-width: 1025px)');

  return {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
  };
}
