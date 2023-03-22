import type {
  GetAllProductsQuery,
  SwellCartItemInput,
  SwellProduct,
  SwellProductCrossSell,
  SwellProductImage,
  SwellProductOption,
  SwellProductVariant,
} from 'lib/graphql/generated/sdk';
import {
  CategoryData,
  OPTION_INPUT_TYPE,
  ProductOption,
  STOCK_STATUS,
  SwellCategoryWithChildren,
} from 'types/shared/products';
import type {
  SwellProductPurchaseOptions,
  SwellProductPurchaseOptionsSubscriptionPlan,
  Maybe,
  SwellProductVariantPurchaseOptionsStandard,
} from 'lib/graphql/generated/sdk';
import type { SwellProductPurchaseOptionsStandard } from 'lib/graphql/generated/sdk';
import { denullifyArray, NotNullish } from './denullify';
import type { MandatoryImageProps } from 'types/global';
import type { CartItemInputOption } from '../../types/shared/cart';
import type { SwellProductsVariants } from 'lib/graphql/generated/sdk';

export const getCrossSellPrice = (crossSell: SwellProductCrossSell) => {
  if (
    crossSell.product?.price === null ||
    crossSell.product?.price === undefined
  )
    return 0;

  switch (crossSell.discountType) {
    case 'percent': {
      if (
        crossSell.discountPercent === null ||
        crossSell.discountPercent === undefined
      )
        return crossSell.product.price;
      return crossSell.product.price * (1 - crossSell.discountPercent / 100);
    }
    case 'amount': {
      if (
        crossSell.discountAmount === null ||
        crossSell.discountAmount === undefined
      )
        return crossSell.product.price;
      return crossSell.product.price - crossSell.discountAmount;
    }
    default:
      return crossSell.product.price;
  }
};

type SubscriptionPlanWithTrialPrice =
  SwellProductPurchaseOptionsSubscriptionPlan & {
    origPrice?: number;
  };

/**
 * Validates that the subscription plan has an active trial, and if it does,
 * sets the `price` property value to `0` to match what the customer would be
 * immediately charged for, and also sets a property `origPrice` with the
 * original price.
 * @param subscriptionPlan Subscription Purchase Plan.
 * @returns Subscription Plan with an adjusted price if it has a trial.
 */
function adjustTrialPrice(
  subscriptionPlan?: Maybe<SwellProductPurchaseOptionsSubscriptionPlan>,
) {
  if (!subscriptionPlan) return;
  const trialDays = subscriptionPlan?.billingSchedule?.trialDays;
  const planWithTrial: SubscriptionPlanWithTrialPrice = {
    ...subscriptionPlan,
  };
  if (trialDays && trialDays > 0) {
    planWithTrial.origPrice = planWithTrial.price;
    planWithTrial.price = 0;
  }
  return planWithTrial;
}

export interface ActiveVariation extends SwellProductVariant {
  standardPrice?: Maybe<
    | SwellProductVariantPurchaseOptionsStandard
    | SwellProductPurchaseOptionsStandard
  >;
  subscriptionPrice?: SubscriptionPlanWithTrialPrice;
}

export const getActiveVariation = (
  selectedOptions: SwellCartItemInput['options'],
  selectedPlan: Maybe<SwellProductPurchaseOptionsSubscriptionPlan>,
  productOptions: ProductOption[],
  productPurchaseOptions: SwellProductPurchaseOptions,
  productVariants: SwellProductVariant[],
  stockLevel: SwellProduct['stockLevel'],
): ActiveVariation | undefined => {
  // If there are no variants, use the standard price and selected plan – if they exist
  if (!productVariants.length) {
    return {
      standardPrice: productPurchaseOptions.standard,
      subscriptionPrice: adjustTrialPrice(selectedPlan),
      stockLevel,
    };
  }

  // Get the matching variant
  const matchingVariant = productVariants?.find(variant =>
    // Match if every optionValueId is in selectedOptions
    variant.optionValueIds?.every(valueId =>
      selectedOptions?.some(option => option?.valueId === valueId),
    ),
  );

  if (!matchingVariant) return;

  // We need the Subscription purchase option as part of the variant schema.
  // Variant schema should also have these fields:
  // sale: matchingVariant.sale,
  // salePrice: matchingVariant.salePrice,
  // Maybe also make purchaseOption.standard mandatory in this schema
  const standardPrice = {
    ...matchingVariant.purchaseOptions?.standard,
  };

  standardPrice.price = standardPrice.price ?? matchingVariant.price;
  standardPrice.origPrice =
    standardPrice.origPrice ?? matchingVariant.origPrice;

  let subscriptionPrice;

  if (productPurchaseOptions.subscription) {
    const subscriptionPlan = productPurchaseOptions.subscription.plans?.find(
      plan => plan?.id === selectedPlan?.id,
    );

    if (subscriptionPlan) {
      subscriptionPrice = { ...subscriptionPlan };
      // In case we need to store the option values in use like swell-js does
      // const selectedOptionValues = [];
      let addPriceTotal = 0;

      productOptions?.forEach(option => {
        // If the current option is among the selected options...
        const selectedOption = selectedOptions?.find(
          _selectedOption => _selectedOption?.id === option.id,
        );

        if (selectedOption) {
          // ...then get the corresponding value that matches its valueId
          const selectedValue = option.values?.find(
            value => value.id === selectedOption.valueId,
          );

          if (selectedValue) {
            // selectedOptionValues.push(selectedValue);
            // add its price to the total of variant add prices
            addPriceTotal += selectedValue.price ?? 0;
          }
        }
      });

      // Add the total of addPrices to the subscription price. If we had a subscription
      // purchase option directly in the variant schema then this wouldn't be needed
      // and would be easier to sync option/variant add price with list price.
      // If a subscription purchase option is added then we might also need to search for the specific
      // plan inside the purchase options.
      if (subscriptionPrice.price) {
        // also add to salePrice, etc (if it was part of the schema)
        subscriptionPrice.price =
          (subscriptionPlan?.price || 0) + addPriceTotal;
      }
    }
  }

  return {
    ...matchingVariant,
    standardPrice,
    subscriptionPrice: adjustTrialPrice(subscriptionPrice),
  };
};

export const mapCategory = (
  category: SwellCategoryWithChildren,
): CategoryData => ({
  slug: category?.slug ?? '',
  name: category?.name ?? '',
  id: category?.id ?? '',
  children: mapCategories(category?.children ?? []),
});
export const mapCategories = (categories: SwellCategoryWithChildren[]) => {
  const result = categories.map(category => mapCategory(category));
  return result;
};

export const mapProducts = (
  products: Pick<
    NotNullish<
      NotNullish<NotNullish<GetAllProductsQuery['products']>['results']>[number]
    >,
    | 'id'
    | 'description'
    | 'descriptionShort'
    | 'slug'
    | 'images'
    | 'options'
    | 'name'
    | 'price'
    | 'origPrice'
    | 'purchaseOptions'
    | 'variants'
    | 'stockLevel'
    | 'tags'
  >[],
) =>
  products.map(product => {
    return {
      id: product.id ?? '',
      description: product.description ?? '',
      descriptionShort: product.descriptionShort ?? '',
      tags: product.tags ?? [],
      href: `/products/${product.slug}`,
      image: {
        alt: product.images?.[0]?.caption ?? '',
        height: product.images?.[0]?.file?.height ?? 0,
        width: product.images?.[0]?.file?.width ?? 0,
        src: product.images?.[0]?.file?.url ?? '',
      },
      price: product.price ?? 0,
      origPrice: product.origPrice ?? null,
      title: product.name ?? '',
      productOptions: denullifyArray(product?.options).map(
        (option: SwellProductOption) => {
          return {
            id: option.id ?? '',
            attributeId: option.attributeId ?? '',
            name: option.name ?? '',
            inputType: option.inputType ?? '',
            active: option.active ?? true,
            required: option.required ?? false,
            values: filterMapProductOptionValuesByStockAndVariantAvailability(
              option,
              product,
            ),
          };
        },
      ),
      productVariants: denullifyArray(product.variants?.results),
      purchaseOptions: product.purchaseOptions ?? {},
      hasQuickAdd: hasQuickAdd(product),
      stockLevel: product?.stockLevel ?? 0,
    };
  });

// A product has quick add if:
// - Product doesn't have subscription
//                    and
// (
//  - Product has up to 2 options and options are select/toggle
//                    or
//  - Product is gift card
//                    or
//  - Product doesn't have any options
// )

export const hasQuickAdd = (product: SwellProduct): boolean =>
  !product.purchaseOptions?.subscription &&
  ((!!product?.options?.length &&
    product.options.length < 3 &&
    (!product?.options?.some(
      option =>
        ![OPTION_INPUT_TYPE.SELECT, OPTION_INPUT_TYPE.TOGGLE].includes(
          option?.inputType as OPTION_INPUT_TYPE,
        ),
    ) ||
      !!product?.categories?.some(
        category => category?.slug === 'gifts-sets',
      ))) ||
    product?.options?.length === 0);

/** Checks if there is a limited amount of stock by looking into
 * if the product stock is being tracked and if it is
 * purchasable when out of stock.
 */
export const isStockLimited = (
  stockTracking: SwellProduct['stockTracking'],
  stockPurchaseable: SwellProduct['stockPurchasable'] = false,
): boolean => !!stockTracking && !stockPurchaseable;

export interface StockStatusArgs {
  stockTracking: SwellProduct['stockTracking'];
  stockPurchasable: SwellProduct['stockPurchasable'];
  stockLevel: SwellProduct['stockLevel'];
  lowStockIndicator?: number | null;
}

type getStockStatusType = (args: StockStatusArgs) => STOCK_STATUS;

export const getStockStatus: getStockStatusType = ({
  stockTracking,
  stockPurchasable,
  stockLevel,
  lowStockIndicator,
}) => {
  // If product purchases are not limited by the stock level
  // then the product is marked as in stock.
  if (!isStockLimited(stockTracking, stockPurchasable)) {
    return STOCK_STATUS.IN_STOCK;
  }

  // If there is stock...
  if (stockLevel && stockLevel > 0) {
    // ...but it's below the threshold, then mark it as low stock.
    if (lowStockIndicator && stockLevel <= lowStockIndicator) {
      return STOCK_STATUS.LOW_STOCK;
    }
    // ...otherwise, simply mark it as in stock.
    return STOCK_STATUS.IN_STOCK;
  }

  // If none of the previous conditions apply, then mark it as out of stock.
  return STOCK_STATUS.OUT_OF_STOCK;
};

export type SwellProductImageWithColor = SwellProductImage & {
  colorId?: string;
};

export const formatProductImages = (
  images?: (SwellProductImageWithColor | null)[] | null,
): MandatoryImageProps[] => {
  const formattedImages =
    images?.map(image =>
      image?.file?.url
        ? {
            alt: image.caption ?? '',
            height: image.file.height ?? 0,
            width: image.file.width ?? 0,
            src: image.file.url ?? '',
            id: image.id ?? '',
            colorId: image.colorId ?? '',
          }
        : null,
    ) ?? [];
  return denullifyArray(formattedImages);
};

export const isOptionValueInStock = (
  curOptions: CartItemInputOption[],
  productData: {
    productOptions: ProductOption[];
    purchaseOptions: SwellProductPurchaseOptions;
    productVariants: SwellProductVariant[];
    stockLevel?: SwellProduct['stockLevel'];
  },
) => {
  const curVariant = getActiveVariation(
    curOptions,
    productData.purchaseOptions.subscription?.plans?.[0] ?? null,
    productData.productOptions,
    productData.purchaseOptions,
    productData.productVariants,
    productData.stockLevel,
  );
  return (
    curVariant?.active && curVariant?.stockLevel && curVariant.stockLevel > 0
  );
};

export const addStockOptionData = (
  productOptions: ProductOption[],
  selectedProductOptions: Map<string, string>,
  purchaseOptions: SwellProductPurchaseOptions,
  productVariants: SwellProductVariant[],
  stockLevel?: SwellProduct['stockLevel'],
) => {
  const updatedProductOptions = [...productOptions];
  const colorOptions = updatedProductOptions.find(o =>
    getColorOptionArrayIds(o).includes('color'),
  );
  const sizeOptions = updatedProductOptions.find(o =>
    getColorOptionArrayIds(o).includes('size'),
  );
  if (colorOptions?.values && sizeOptions && colorOptions) {
    colorOptions.values.forEach(colorOpt => {
      colorOpt.disabled = !sizeOptions.values?.some(sizeOpt => {
        return isOptionValueInStock(
          [
            { id: colorOptions.id, valueId: colorOpt.id },
            { id: sizeOptions.id, valueId: sizeOpt.id },
          ],
          {
            productOptions,
            purchaseOptions,
            productVariants,
            stockLevel,
          },
        );
      });
    });

    const currentColorOptValue = selectedProductOptions.get(colorOptions.id);
    if (currentColorOptValue) {
      sizeOptions.values?.forEach(sizeOpt => {
        sizeOpt.disabled = !isOptionValueInStock(
          [
            { id: colorOptions.id, valueId: currentColorOptValue },
            { id: sizeOptions.id, valueId: sizeOpt.id },
          ],
          {
            productOptions,
            purchaseOptions,
            productVariants,
            stockLevel,
          },
        );
      });
    }
  }
  return updatedProductOptions;
};

// filter product.variants with not repeated color
export const filterProductVariants = (
  product: SwellProduct,
  colorOption: SwellProductOption,
) =>
  product?.variants?.results?.reduce(
    (acc: SwellProductsVariants['results'], variant) => {
      if (!acc) {
        return variant?.active ? [variant] : [];
      }
      if (
        !variant?.active ||
        acc.some(q =>
          q?.optionValueIds?.includes(
            variant?.optionValueIds?.find(v =>
              colorOption?.values?.find(t => t?.id === v),
            ) ?? null,
          ),
        )
      ) {
        return acc;
      }
      return [...acc, variant];
    },
    [],
  );

export const filterMapProductOptionValuesByStockAndVariantAvailability = (
  option: SwellProductOption,
  product: SwellProduct,
) =>
  denullifyArray(option.values)
    ?.filter(opt =>
      product?.variants?.results?.some(
        v => opt?.id && v?.optionValueIds?.includes(opt?.id),
      ),
    )
    .map(value => {
      return {
        id: value.id ?? '',
        name: value.name ?? '',
        price: value.price ?? 0,
        description: value.description ?? '',
      };
    });

export const getColorOptionArrayIds = (productOption: ProductOption) => [
  productOption.name.toLowerCase(),
  productOption.attributeId,
  productOption.attributeIdCustomId?.toLowerCase(),
];

export const getColorOptionId = (productOption: ProductOption) =>
  productOption.attributeId ||
  productOption.attributeIdCustomId ||
  productOption.name.toLowerCase();
