import { generateId } from 'lib/utils/shared_functions';
import type {
  SwellCategory,
  SwellProductImage,
  SwellProductOption,
} from 'lib/graphql/generated/sdk';
import { denullifyArray } from 'lib/utils/denullify';
import { filterProductsByCategory, getFilters } from './filters';
import getGQLClient, { getSwellRESTClient } from 'lib/graphql/client';
import type { CategoryPreviewCardProps } from 'components/atoms/CategoryPreviewCard';
import type {
  ProductsLayoutProps,
  ProductsLayoutSettings,
  ProductsPerRow,
} from 'components/layouts/ProductsLayout';
import type {
  CategoryData,
  PurchasableProductData,
} from 'types/shared/products';
import type { ProductHeaderProps } from 'components/molecules/ProductHeader';
import { LAYOUT_ALIGNMENT, ProductsPageProps } from 'pages/products/[slug]';
import type { CurrencyPrice } from 'types/shared/currency';
import type { QuizResultsProducts } from 'components/molecules/QuizResults';
import {
  filterMapProductOptionValuesByStockAndVariantAvailability,
  filterProductVariants,
  mapCategories,
  mapProducts,
  mapProductsResponse,
  parseSizeChart,
} from 'lib/utils/products';
import {
  formatCurrencies,
  formatLocales,
  formatStoreSettings,
} from 'utils/settings';
import { formatProductImages } from 'lib/utils/products';
import {
  ProductCategories,
  ProductType,
  SwellCategoryWithChildren,
} from 'types/shared/products';
import type { SwellProduct } from 'lib/graphql/generated/sdk';
import { getDefaultLangJsonByLocale, LocaleCode } from '../../hooks/useI18n';
import { deepMerge } from '../../utils/helpers';
import useGlobalUI from '../../stores/global-ui';
import type { ResultsResponse } from 'swell-js';

const client = getGQLClient();
const clientRest = getSwellRESTClient();

export const getCategories = async ({
  currentSlug,
  locale,
}: {
  currentSlug?: string;
  locale?: string;
}) => {
  const { setLoading } = useGlobalUI.getState();
  setLoading(true);
  const { categories: categoriesResponse } = await client
    .getCategories({ locale })
    .then(response => response.data);

  const categoriesList = denullifyArray(categoriesResponse?.results);

  const featuredCategoriesList = denullifyArray(
    categoriesList[0]?.content?.featuredCategories?.map(
      featured => featured?.category,
    ),
  );

  const featuredCategoriesData = featuredCategoriesList.map<
    (CategoryPreviewCardProps & { id: string }) | null
  >(featuredCategory => {
    return {
      id: generateId(),
      href: `/categories/${featuredCategory.slug ?? ''}`,
      title: featuredCategory.name ?? '',
      image: {
        alt: featuredCategory.images?.[0]?.caption ?? '',
        src: featuredCategory.images?.[0]?.file?.url ?? '',
        height: featuredCategory.images?.[0]?.file?.height ?? 0,
        width: featuredCategory.images?.[0]?.file?.width ?? 0,
      },
      preserveScroll: true,
      scaleOnHover: true,
      isActive: currentSlug === featuredCategory?.slug,
    };
  });

  // reduce categories to an array with children array grouped by parentId
  // const categories = categoriesList.reduce((acc, category) => {
  //   const parent = categoriesList.find(c => c.id === category.parentId);
  //   if (parent) {
  //     const parentInAcc = acc.find(c => c?.id === parent.id);
  //     if (parentInAcc) {
  //       parentInAcc.children?.push(category);
  //     } else {
  //       acc.push({
  //         ...parent,
  //         children: [category],
  //       });
  //     }
  //   } else {
  //     if (!acc.some(c => c?.id === category.id)) {
  //       acc.push(category);
  //     }
  //   }
  //   return acc;
  // }, [] as SwellCategoryWithChildren[]);

  // display only TOP categories without parents
  // and only with displayOnTheSite flag enabled
  const categoriesData = mapCategories(
    categoriesList.filter(
      c => !c.parentId && c.displayOnTheSite,
    ) as SwellCategoryWithChildren[],
  );

  const settings: ProductsLayoutSettings = {
    featuredCategories: denullifyArray(featuredCategoriesData),
    productsPerRow:
      (categoriesList[0]?.content?.productsPerRow as ProductsPerRow) ?? 3,
    enableQuickAdd: categoriesList[0]?.content?.enableQuickAdd ?? false,
    showFeaturedCategories:
      categoriesList[0]?.content?.showFeaturedCategories ?? false,
    showProductsDescription:
      categoriesList[0]?.content?.showProductsDescription ?? false,
    showProductsPrice: categoriesList[0]?.content?.showProductsPrice ?? false,
  };

  setLoading(false);
  return {
    categories: categoriesData,
    settings,
  };
};

// TODO take all products from category "all-products"
export const getProductsList = async (
  categorySlug?: string | CategoryData,
  currency?: string,
  locale?: string,
) => {
  const { setLoading } = useGlobalUI.getState();
  setLoading(true);
  // Get the products list

  const { products } = await client
    .getAllProducts({ limit: 100, currency, locale })
    .then(response => response.data);

  const productResults = filterProductsByCategory(
    (products?.results as SwellProduct[]) ?? [],
    categorySlug,
  );

  setLoading(false);

  return productResults;
};

export const getProductListingData = async (
  categorySlug?: string | CategoryData,
  locale?: string,
): Promise<ProductsLayoutProps> => {
  const { setLoading } = useGlobalUI.getState();
  setLoading(true);
  // Get the products list
  const productsPromise = getProductsList(categorySlug, undefined, locale);

  // Get featured categories
  const categoriesPromise = getCategories({
    currentSlug:
      typeof categorySlug === 'string' ? categorySlug : categorySlug?.slug,
    locale,
  });

  const [{ categories, settings }, productResults] = await Promise.all([
    categoriesPromise,
    productsPromise,
  ]);

  const attributeFilters = getFilters(productResults);

  setLoading(false);
  return {
    categories,
    settings,
    attributeFilters,
  };
};

export const fetchProductBySlug = async (slug: string) => ({
  ...((await client.getProduct({ slug }).then(response => response.data))
    ?.productBySlug ?? {}),
  slug,
});

// Remove?
export const getAllProducts = async (): Promise<{
  products: PurchasableProductData[];
  count: number;
}> => {
  const { setLoading } = useGlobalUI.getState();
  setLoading(true);
  const { data: storeData } = await client.getStoreSettings();
  const currencies = storeData.storeSettings?.store?.currencies;

  const allPricesByProduct: Map<string, CurrencyPrice[]> = new Map();

  const currenciesPromises = currencies?.map(currency => {
    if (currency?.code) {
      return client
        .getProductsPricesInCurrency({ currency: currency.code })
        .then(res => {
          res.data.products?.results?.forEach(product => {
            if (product?.id && product?.price && product?.currency) {
              const newPrices = allPricesByProduct.get(product.id) ?? [];
              newPrices.push({
                price: product.price,
                currency: product.currency,
              });
              allPricesByProduct.set(product.id, newPrices);
            }
          });
        });
    }
  });

  if (currenciesPromises?.length) {
    await Promise.all(currenciesPromises);
  }

  const response = await client.getAllProducts();
  const { products: productsResult } = response.data;

  const productsList = productsResult?.results ?? [];

  const products = mapProducts(denullifyArray(productsList));

  setLoading(false);
  return {
    products: denullifyArray(products),
    count: productsResult?.count ?? 0,
  };
};

export async function getProductBySlug(
  slug: string,
  options?: {
    currency?: string;
    locale?: string;
    skipTriggeringGlobalLoading?: boolean;
  },
): Promise<ProductsPageProps> {
  const { setLoading } = useGlobalUI.getState();
  if (!options?.skipTriggeringGlobalLoading) {
    setLoading(true);
  }
  const { currency, locale } = options ?? {};
  const response = await client.getProduct({
    slug,
    currency,
    locale,
  });
  const { productBySlug: product } = response.data;

  // reduce categories to one string by name prop
  const subtitle = product?.categories
    // we filter with NON ProductCategories.allProducts category to hide it from the breadcrumbs
    // now all of the products are in the "all-products" category to have an sorting feature
    ?.filter(q => q?.slug !== ProductCategories.allProducts)
    .reduce(
      (acc, category) => `${acc ? `${acc} >` : ''} ${category?.name} `,
      '',
    );

  const details: ProductHeaderProps = {
    title: product?.name ?? '',
    subtitle: subtitle ?? '',
    description: product?.description ?? '',
    descriptionShort: product?.descriptionShort ?? '',
  };

  const colorOption = product?.options?.find(option =>
    [option?.name?.toLowerCase(), option?.attributeId].includes('color'),
  );

  // filter product.variants with not repeated color
  const filteredVariants = filterProductVariants(
    product as SwellProduct,
    colorOption as SwellProductOption,
  );

  const images = formatProductImages(
    filteredVariants?.map(variant =>
      variant?.images?.[0]
        ? ({
            ...variant?.images?.[0],
            colorId:
              variant?.optionValueIds?.find(v =>
                colorOption?.values?.find(t => t?.id === v),
              ) ?? null,
          } as SwellProductImage)
        : null,
    ) ?? [],
  );

  const sortedImages = images.sort((a, b) => {
    if (a?.colorId && b?.colorId) {
      return (
        colorOption?.values?.findIndex(value => value?.id === a?.colorId)! -
        colorOption?.values?.findIndex(value => value?.id === b?.colorId)!
      );
    }
    return 0;
  });

  // reduce product.variants to array of images[i].file prop by variant color prop
  if (!options?.skipTriggeringGlobalLoading) {
    setLoading(false);
  }
  return {
    slug,
    productId: product?.id ?? '',
    isGiftCard:
      product?.categories?.some(category => category?.slug === 'gifts-sets') ??
      false,
    currency: product?.currency ?? 'USD',
    details,
    productBenefits: denullifyArray(
      product?.content?.productHighlights ?? [],
    ).map(benefit => {
      return {
        id: benefit.id ?? '',
        icon: benefit.icon ?? '',
        label: benefit.label ?? '',
        customIcon: benefit.customIcon ?? {
          url: '',
          width: 0,
          height: 0,
        },
      };
    }),
    expandableDetails: denullifyArray(
      product?.content?.expandableDetails ?? [],
    ),
    images: sortedImages.length
      ? sortedImages
      : formatProductImages(product?.images ?? []),
    productOptions: denullifyArray(product?.options)?.map(
      (option: SwellProductOption) => {
        return {
          id: option.id ?? '',
          attributeId: option.attributeId ?? '',
          attributeIdCustomId: option.attributeIdCustomId ?? '',
          name: option.name ?? '',
          description: option.description ?? '',
          inputType: option.inputType ?? '',
          active: option.active ?? true,
          required: option.required ?? false,
          parentId: option.parentId ?? null,
          parentValueIds: denullifyArray(option.parentValueIds),
          placeholder: option.inputHint ?? '',
          values: filterMapProductOptionValuesByStockAndVariantAvailability(
            option,
            product as SwellProduct,
          ),
        };
      },
    ),
    purchaseOptions: product?.purchaseOptions ?? {},
    productVariants: denullifyArray(product?.variants?.results),
    upSells: denullifyArray(product?.upSells),
    stockLevel: product?.stockLevel,
    stockPurchasable: product?.stockPurchasable,
    stockTracking: product?.stockTracking,
    tags: product?.tags ?? [],
    meta: {
      title: product?.metaTitle ?? '',
      description: product?.metaDescription ?? product?.descriptionShort ?? '',
    },
    settings: {
      layoutOptions: (product?.content?.layoutOptions ??
        LAYOUT_ALIGNMENT.STANDARD) as LAYOUT_ALIGNMENT,
      calloutTitle: product?.content?.calloutTitle ?? null,
      calloutDescription: product?.content?.calloutDescription ?? null,
      showStockLevels: product?.content?.showStockLevels ?? true,
      enableProductCounter: product?.content?.enableProductCounter ?? true,
      lowStockIndicator: product?.content?.lowStockIndicator ?? null,
    },
    sizeChart: product?.sizeChart ? parseSizeChart(product.sizeChart) : [],
  };
}

export async function getQuizProducts(
  productsSlugs: string[],
  currency?: string,
): Promise<{
  selection: QuizResultsProducts;
  currency: string;
}> {
  if (!productsSlugs.length) {
    return {
      selection: [],
      currency: currency ?? 'USD',
    };
  }

  const getProductsBySlugs = (slugs: string[]) =>
    slugs.map(slug =>
      client
        .getProduct({ slug, currency })
        .then(response => response.data.productBySlug),
    );

  const productsPromises = getProductsBySlugs(productsSlugs);

  const productsData = await Promise.all(productsPromises);

  const selection = denullifyArray(productsData).map(product => ({
    productId: product.id ?? '',
    description: product.description ?? '',
    descriptionShort: product.descriptionShort ?? '',
    currency: product.currency ?? 'USD',
    href: `/products/${product.slug}`,
    image: {
      alt: product.images?.[0]?.caption ?? '',
      height: product.images?.[0]?.file?.height ?? 0,
      width: product.images?.[0]?.file?.width ?? 0,
      src: product.images?.[0]?.file?.url ?? '',
    },
    purchaseOptions: product.purchaseOptions ?? {},
    title: product.name ?? '',
    cross: product.crossSells,
    productOptions: denullifyArray(product?.options).map(
      (option: SwellProductOption) => {
        return {
          id: option.id ?? '',
          attributeId: option.attributeId ?? '',
          name: option.name ?? '',
          inputType: option.inputType ?? '',
          active: option.active ?? true,
          required: option.required ?? false,
          values: denullifyArray(option.values).map(value => {
            return {
              id: value.id ?? '',
              name: value.name ?? '',
            };
          }),
        };
      },
    ),
    productVariants: denullifyArray(product?.variants?.results),
  }));

  return {
    selection: denullifyArray(selection),
    currency: currency ?? 'USD',
  };
}

export const getStoreSettings = async (locale?: string) => {
  const [storeData, menusData] = await Promise.all([
    client.getStoreSettings({ locale }),
    client.getMenus({ locale }),
  ]);

  const formattedSettings = formatStoreSettings(
    storeData.data.storeSettings,
    menusData.data.menuSettings,
  );

  const settingsWithMergedLocale = {
    ...formattedSettings,
    lang: deepMerge(
      getDefaultLangJsonByLocale(locale as LocaleCode | undefined),
      formattedSettings.lang,
    ),
  };

  const { setLoading } = useGlobalUI.getState();
  setLoading(false);

  return {
    ...settingsWithMergedLocale,
    locales: formatLocales(storeData.data.storeSettings),
    currencies: formatCurrencies(storeData.data.storeSettings),
  };
};

export const getBundles = async () => {
  const { products } = await client
    .getFilteredProducts({
      filter: {
        type: { $eq: ProductType.bundle },
      },
    })
    .then(response => response.data);

  const productResults = denullifyArray(products?.results);

  return productResults;
};
export const getBestsellers = async (locale?: string) => {
  const { categoryBySlug } = await client
    .getCategory({
      slug: ProductCategories.bestseller,
      locale,
    })
    .then(response => response.data);

  const productResults = mapProducts(denullifyArray(categoryBySlug?.products));

  return productResults;
};

// products are sorted on the swell dashboard
// we use a one category for all of the products trick
export const getProductListingDataSorted = async (
  categorySlug?: string | CategoryData,
  currency?: string,
  locale?: string,
) => {
  const { setLoading } = useGlobalUI.getState();
  setLoading(true);
  // Get the products list

  // const productsRes = await client
  //   .getCategory({
  //     slug: ProductCategories.allProducts,
  //     locale,
  //   })
  //   .then(response => response.data);
  // const products = productsRes?.categoryBySlug?.products;
  if (locale) {
    await clientRest.locale.select(locale);
  }
  let categoryDetails = (await clientRest.categories.get(
    ProductCategories.allProductsID,
    // @ts-ignore
    {
      expand: ['products:100'],
    },
  )) as unknown as SwellCategory;

  const products = mapProductsResponse(
    categoryDetails.products as unknown as ResultsResponse<SwellProduct>,
  );

  const productResults = filterProductsByCategory(
    (products as SwellProduct[]) ?? [],
    categorySlug,
  );

  setLoading(false);

  return productResults;
};
