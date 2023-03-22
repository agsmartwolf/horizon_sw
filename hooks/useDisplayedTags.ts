import { useMemo } from 'react';
import ProductConfig from '../config/products';

export function useDisplayedTags(tags?: Array<string | null>) {
  const displayedTags = useMemo(() => {
    return tags?.filter(
      t =>
        t &&
        ProductConfig.labelsToShowOnProductPreview.includes(t.toLowerCase()),
    );
  }, [tags]);
  return displayedTags;
}
