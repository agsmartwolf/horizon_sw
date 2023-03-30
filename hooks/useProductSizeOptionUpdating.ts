import { useEffect } from 'react';
import {
  getColorOptionArrayIds,
  isOptionValueInStock,
} from '../lib/utils/products';
import { Action, ACTIONS, ReducerState } from './useProductSelection';
import type { ProductOption } from '../types/shared/products';
import type {
  Maybe,
  SwellProductPurchaseOptions,
  SwellProductVariant,
} from '../lib/graphql/generated/sdk';

// choosing the first available size option when the color changes

interface IUseProductSizeOptionUpdatingProps {
  colorOptionId?: string;
  productOptions: ProductOption[];
  productVariants: SwellProductVariant[];
  purchaseOptions: SwellProductPurchaseOptions;
  stockLevel: Maybe<number> | undefined;
  state: ReducerState;
  dispatch: React.Dispatch<Action>;
}
export function useProductSizeOptionUpdating({
  colorOptionId,
  productOptions,
  productVariants,
  purchaseOptions,
  stockLevel,
  state,
  dispatch,
}: IUseProductSizeOptionUpdatingProps) {
  const curColor = state.selectedProductOptions.get(colorOptionId ?? '');
  useEffect(() => {
    if (curColor && colorOptionId) {
      // update the current size option depending on the color
      const sizeOptions = productOptions.find(o =>
        getColorOptionArrayIds(o).includes('size'),
      );
      if (!sizeOptions) {
        return;
      }
      const firstAvailableSizeOpt = sizeOptions.values?.find(sizeOpt =>
        isOptionValueInStock(
          [
            { id: colorOptionId, valueId: curColor },
            { id: sizeOptions.id, valueId: sizeOpt.id },
          ],
          {
            productOptions,
            purchaseOptions,
            productVariants,
            stockLevel,
          },
        ),
      );
      if (firstAvailableSizeOpt) {
        dispatch({
          type: ACTIONS.SET_SELECTED_PRODUCT_OPTIONS,
          payload: {
            optionId: sizeOptions.id,
            valueId: firstAvailableSizeOpt.id,
          },
        });
      }
    }
  }, [
    colorOptionId,
    curColor,
    dispatch,
    productOptions,
    productVariants,
    purchaseOptions,
    stockLevel,
  ]);
}
