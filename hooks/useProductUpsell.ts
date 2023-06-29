import { denullifyArray } from '../lib/utils/denullify';
import type { PurchasableProductData } from '../types/shared/products';
import type {
  SwellProduct,
  SwellProductUpSell,
} from '../lib/graphql/generated/sdk';
import { mapProductUpsell } from '../lib/utils/products';
import getGQLClient from '../lib/graphql/client';
import { useEffect, useState } from 'react';

const client = getGQLClient();

interface UseProductUpsellProps {
  isFetchAllowed: boolean;
  productUpSell?: SwellProductUpSell[];
  locale?: string;
  currency?: string;
}
export const useProductUpsell = ({
  productUpSell,
  currency,
  locale,
  isFetchAllowed,
}: UseProductUpsellProps) => {
  const [upSells, setUpsells] = useState<PurchasableProductData[]>([]);

  useEffect(() => {
    (async () => {
      if (!productUpSell || !isFetchAllowed) return;
      const productsUpsellsRes = (
        await Promise.all(
          denullifyArray(productUpSell)
            ?.filter(p => !!p?.product?.slug)
            ?.map(p =>
              client.getProduct({
                slug: p?.product?.slug,
                currency,
                locale,
              }),
            ),
        )
      ).map(response => response.data.productBySlug);

      const mappedResult = mapProductUpsell(
        productsUpsellsRes as SwellProduct[],
      );
      setUpsells(denullifyArray(mappedResult));
    })();
  }, [productUpSell, locale, currency, isFetchAllowed]);

  return upSells;
};
