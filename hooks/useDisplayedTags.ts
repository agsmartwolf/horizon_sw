import { useMemo } from 'react';
import ProductConfig from '../config/products';
import { GenericTagType } from '../components/atoms/GenericTag';
import type { Maybe } from 'lib/graphql/generated/sdk';

export function useDisplayedTags(
  tags: Array<string | null>,
  stockLevel: Maybe<number> | undefined,
) {
  const displayedTags = useMemo(() => {
    const r = tags?.filter(
      t =>
        t &&
        ProductConfig.labelsToShowOnProductPreview.includes(t.toLowerCase()),
    );
    return stockLevel && stockLevel > 0 ? r : [GenericTagType.NotInStock];
  }, [tags, stockLevel]);
  return displayedTags;
}
