import type {
  SwellProductPurchaseOptions,
  SwellProductVariant,
} from 'lib/graphql/generated/sdk';
import type { PRODUCT_ATTRIBUTE_TYPE } from 'lib/shop/filters';
import type { MandatoryImageProps } from 'types/global';
import type { CurrencyPrice } from './currency';
import type { Maybe } from 'graphql/jsutils/Maybe';
import type { SwellCategory } from 'lib/graphql/generated/sdk';

export enum PURCHASE_OPTION_TYPE {
  STANDARD = 'standard',
  SUBSCRIPTION = 'subscription',
  NULL = 'null',
}

// stock status options possible in the backend
// (to be expanded as more options are needed)
export enum SWELL_STOCK_STATUS {
  IN_STOCK = 'in_stock',
}

// internal type for stock status
export enum STOCK_STATUS {
  IN_STOCK = 'in-stock',
  LOW_STOCK = 'low-stock',
  OUT_OF_STOCK = 'out-of-stock',
}

export interface ProductData {
  id: string;
  image: MandatoryImageProps;
  title: string;
  description: string;
  descriptionShort?: string;
  price?: number;
  origPrice?: number;
  currency?: string;
  originalPrice?: number;
  href: string;
  currencyPrices?: CurrencyPrice[];
  purchaseOptions?: SwellProductPurchaseOptions;
  tags?: Array<string | null>;
}

export interface CategoryData {
  name: string;
  id?: string;
  slug: string;
  children?: Maybe<CategoryData>[];
}

export type SwellCategoryWithChildren = Maybe<
  SwellCategory & Maybe<{ children?: SwellCategoryWithChildren[] }>
>;

export interface ProductOption {
  description?: string;
  id: string;
  attributeId: string;
  attributeIdCustomId?: string;
  name: string;
  inputType: string;
  active: boolean;
  required: boolean;
  parentId?: null | string;
  parentValueIds?: null | string[];
  placeholder?: string;
  values?: {
    id: string;
    name: string;
    description?: string;
    price?: number;
    disabled?: boolean;
  }[];
}

export enum OPTION_INPUT_TYPE {
  SELECT = 'select',
  TOGGLE = 'toggle',
  SHORT_TEXT = 'short_text',
  LONG_TEXT = 'long_text',
}

export enum INTERVAL {
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
  Yearly = 'yearly',
}

export interface FilterState {
  group: string;
  values: Set<string>;
}

export interface ProductFilterOptionValue {
  label: string;
  value: string;
}

export interface ProductFilterOption {
  id: string;
  name: string;
  values: ProductFilterOptionValue[];
  type: PRODUCT_ATTRIBUTE_TYPE;
}

export interface ProductFilterRangeOption {
  id: string;
  name: string;
  values: [number, number];
  type: 'range';
}

export interface ProductAttribute {
  name: string | null;
  type: PRODUCT_ATTRIBUTE_TYPE | null;
  visible: boolean | null;
  filterable: boolean | null;
  id: string | null;
  value: string | string[] | null;
}

export interface PurchasableProductData extends ProductData {
  productOptions: ProductOption[];
  productVariants: SwellProductVariant[];
  purchaseOptions: SwellProductPurchaseOptions;
  hasQuickAdd: boolean;
  stockLevel: number;
  tags?: Array<string | null>;
}

export interface StandardPurchaseOption {
  type: PURCHASE_OPTION_TYPE.STANDARD;
}

export interface SubscriptionPurchaseOption {
  type: PURCHASE_OPTION_TYPE.SUBSCRIPTION;
  planId: string;
}

export type PurchaseOption =
  | StandardPurchaseOption
  | SubscriptionPurchaseOption;

export enum ProductType {
  bundle = 'bundle',
  physical = 'physical',
}

export enum ProductTag {
  bestseller = 'bestseller',
}
export enum ProductCategories {
  bestseller = 'bestsellers',
  allProducts = 'all-products',
  allProductsID = '6440f96adb4b390012c8165a',
}
