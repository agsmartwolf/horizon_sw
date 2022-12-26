import { useMediaQuery } from '@react-hook/media-query';

export function useViewport() {
  const isMobile = useMediaQuery('screen and (min-width: 1px) and (max-width: 639px)');
  const isTablet = useMediaQuery('screen and (min-width: 640px) and (max-width: 1025px)');

  return {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet
  };
}
