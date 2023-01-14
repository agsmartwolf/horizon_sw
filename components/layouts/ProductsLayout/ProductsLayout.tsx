import Breadcrumb from 'components/atoms/Breadcrumb';
import ProductCount from 'components/atoms/ProductCount';
import ProductPreviewCard from 'components/atoms/ProductPreviewCard';
import CategoriesPreview from 'components/molecules/CategoriesPreview';
import type { CategoryPreviewCardProps } from 'components/atoms/CategoryPreviewCard';
import type {
  CategoryData,
  FilterState,
  ProductFilterOption,
  ProductFilterOptionValue,
  PurchasableProductData,
} from 'types/shared/products';
import GenericAccordion from 'components/atoms/GenericAccordion';
import React, {
  ChangeEvent,
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Checkbox from 'components/atoms/Checkbox';
import Range from 'components/atoms/Range';
import useCurrency from 'stores/currency';
import {
  applyFilters,
  getPriceRangeFromProducts,
  getPriceRangeFromQuery,
  SearchParams,
} from 'lib/shop/filters';
import { mapProducts } from 'lib/utils/products';
import { getProductsList } from 'lib/shop/fetchingFunctions';
import { Dialog, Transition } from '@headlessui/react';
import Button from 'components/atoms/Button';
import { BUTTON_STYLE, BUTTON_TYPE } from 'types/shared/button';
import { InlineIcon } from '@iconify/react';
import Close from 'assets/icons/close.svg';
import Tag from 'components/atoms/Tag';
import type { EditorArray } from 'types/editor';
import cn from 'classnames';
import getGQLClient from 'lib/graphql/client';
import { generateId } from 'lib/utils/shared_functions';
import type { Replace } from 'types/utils';
import Input from '../../atoms/Input';
import useProductSearch from '../../../hooks/useProductSearch';
import { SECTION_PADDING_MAP, SPACING } from 'lib/globals/sizings';
import TextBody from '../../atoms/Text/TextBody';
import { useViewport } from '../../../hooks/useViewport';

export type ProductsPerRow = 2 | 3 | 4 | 5;

export interface ProductsLayoutSettings {
  showProductsPrice: boolean;
  showProductsDescription: boolean;
  showFeaturedCategories: boolean;
  featuredCategories?: EditorArray<CategoryPreviewCardProps>;
  productsPerRow: ProductsPerRow | `${ProductsPerRow}`;
  enableQuickAdd: boolean;
}

export interface ProductsLayoutProps {
  categories: CategoryData[];
  breadcrumbText?: string;
  attributeFilters: ProductFilterOption[];
  currency?: string;
  settings: ProductsLayoutSettings;
}

const placeholderLabel = 'Search your product';

const ProductsLayout: React.FC<ProductsLayoutProps> = ({
  categories,
  settings,
  breadcrumbText,
  attributeFilters,
}) => {
  const router = useRouter();
  const searchParams: SearchParams = useSearchParams();
  const pathname = usePathname();

  const { isMobile } = useViewport();

  const [formatPrice, activeCurrency] = useCurrency(store => [
    store.formatPrice,
    store.currency,
  ]);

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<PurchasableProductData[]>([]);
  const [activeFilters, setActiveFilters] = useState<FilterState[]>();

  const [priceRangeValue, setPriceRangeValue] = useState<
    [number, number] | undefined
  >();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [priceRangeLimits, setPriceRangeLimits] = useState<[number, number]>([
    0, 0,
  ]);
  const [liveSettings, setLiveSettings] = useState(settings);

  const debounceTimeout = useRef<NodeJS.Timeout | undefined>();

  useEffect(() => {
    const priceParam = searchParams.get('price');
    if (!priceParam) return;
    const r = getPriceRangeFromQuery(priceParam);
    if (!r) return;
    const [pMin, pMax] = r;
    setPriceRangeValue([pMin, pMax]);
  }, [searchParams]);

  const {
    searchTerm,
    onSearchTermChange,
    isSearching,
    results: searchResults,
  } = useProductSearch();

  const getActiveFilters = useCallback(
    (query: SearchParams) =>
      Object.keys(query).reduce<FilterState[]>((result, key) => {
        const queryValue = query.get(key);

        if (!queryValue) return result;

        // Get the array of values from the query parameter
        const values =
          typeof queryValue === 'string' ? [queryValue] : queryValue;

        // Get the filter option
        const filter = attributeFilters.find(filter => filter.id === key);

        if (!filter) return result;

        // Add the filter to the active filters list
        result.push({ group: key, values: new Set(values) });

        return result;
      }, []),
    [attributeFilters],
  );

  const onFiltersChange = useCallback(
    (newActiveFilters: FilterState[]) => {
      // Update the active filters state
      setActiveFilters(newActiveFilters);

      // const updatedQuery = newActiveFilters.reduce<ParsedUrlQueryInput>(
      const updatedQuery = newActiveFilters.reduce<Record<string, string>>(
        (acc, { group, values }) => ({
          ...acc,
          [group]: Array.from(values).toString(),
        }),
        {},
      );

      const slug = searchParams.get('slug');
      if (slug !== null) {
        updatedQuery.slug = slug;
      }

      setLoading(true);

      // Update the url using the new active filters
      router.push(`${pathname}?${new URLSearchParams(updatedQuery)}`);
    },
    [router, searchParams, pathname],
  );

  const onCheck = useCallback(
    (value: string, filter: ProductFilterOption) => {
      if (!activeFilters) return;

      // Find the filter group
      const index = activeFilters.findIndex(a => a.group === filter.id);

      if (index === -1) {
        // If the group doesn't exist, create it
        onFiltersChange([
          ...activeFilters,
          { group: filter.id, values: new Set([value]) },
        ]);
      } else {
        // Clone the array of active filters
        const newActiveFilters = [...activeFilters];

        // Add the value to the set
        newActiveFilters[index].values.add(value);

        onFiltersChange(newActiveFilters);
      }
    },
    [activeFilters, onFiltersChange],
  );

  const onUncheck = useCallback(
    (value: string, filter: ProductFilterOption) => {
      if (!activeFilters) return;

      // Find the filter group
      const index = activeFilters.findIndex(a => a.group === filter.id);

      // If the group doesn't exist, skip
      if (index === -1) return;

      // Clone the array of active filters
      const newCheckedValues = [...activeFilters];

      // Remove the value from the set
      newCheckedValues[index].values.delete(value);

      // If the set is empty, remove the group
      if (newCheckedValues[index].values.size === 0) {
        newCheckedValues.splice(index, 1);
      }

      onFiltersChange(newCheckedValues);
    },
    [activeFilters, onFiltersChange],
  );

  const onPriceRangeChange = useCallback(
    (value: [number, number]) => {
      setPriceRangeValue(value);

      setLoading(true);

      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      // Debounce the price range update to avoid too many server requests
      debounceTimeout.current = setTimeout(() => {
        const updatedQuery = new URLSearchParams(searchParams);
        updatedQuery.set('price', value.toString());

        router.push(`${pathname}?${updatedQuery}`);
      }, 500);
    },
    [router, pathname, searchParams],
  );

  const onCheckboxChange = useCallback(
    (
      e: ChangeEvent<HTMLInputElement>,
      option: ProductFilterOptionValue,
      filter: ProductFilterOption,
    ) => {
      const { checked } = e.target;
      if (checked) {
        onCheck(option.value, filter);
      } else {
        onUncheck(option.value, filter);
      }
    },
    [onCheck, onUncheck],
  );

  const closeFilters = useCallback(() => setMobileFiltersOpen(false), []);

  // Initialize the active filters from the query string
  useEffect(() => {
    // If the active filters have been initialized, return
    if (activeFilters !== undefined) return;

    setActiveFilters(getActiveFilters(searchParams));
  }, [activeFilters, getActiveFilters, searchParams]);

  async function fetchProps(mounted: boolean) {
    const productResults = await getProductsList(
      searchParams.get('slug')?.toString(),
      activeCurrency.code,
    );

    if (!mounted) return;

    // Filter the products list by the current filters
    const filteredProducts = applyFilters(
      attributeFilters,
      productResults,
      searchParams,
    );

    const productData = mapProducts(filteredProducts);

    // Get the price range limits from the list of products
    setPriceRangeLimits(getPriceRangeFromProducts(filteredProducts));
    setProducts(productData);
    setLoading(false);
  }

  // Update the products list when the query string changes
  useEffect(() => {
    let mounted = true;

    fetchProps(mounted);

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCurrency.code, attributeFilters, searchParams]);

  useEffect(() => {
    let mounted = true;
    if (isSearching || (!searchTerm && !searchResults.length)) return;
    if (!searchTerm && searchResults.length) {
      fetchProps(mounted);
    }
    const searchedProducts = mapProducts(searchResults);

    const filteredProducts = applyFilters(
      attributeFilters,
      searchedProducts,
      searchParams,
    );

    const productData = mapProducts(filteredProducts);

    // Get the price range limits from the list of products
    setPriceRangeLimits(getPriceRangeFromProducts(filteredProducts));
    setProducts(productData);

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    products,
    searchResults,
    searchTerm,
    activeCurrency.code,
    attributeFilters,
    searchParams,
  ]);

  // Set up message listeners to update the settings when the user changes them from the editor
  useEffect(() => {
    // Only enable the live updates if the editor variable is set to true
    if (process.env.NEXT_PUBLIC_SWELL_EDITOR !== 'true') return;

    let mounted = true;

    let toCamelCase: (string?: string | undefined) => string | undefined;

    import('lodash.camelcase').then(pkg => {
      toCamelCase = pkg.default;
    });

    const client = getGQLClient();

    const handler = async (event: MessageEvent) => {
      const { type, details } = event.data;

      if (
        type !== 'content.updated' ||
        details?.model !== 'categories' ||
        !details.value
      )
        return;

      if (details.path === 'content') {
        const camelCasedSettings = Object.entries(details.value).reduce(
          (acc, [key, value]) => ({
            ...acc,
            [toCamelCase(key) ?? '']: value,
          }),
          {},
        ) as Replace<
          ProductsLayoutSettings,
          'featuredCategories',
          Array<{ category: { slug: string } }> | undefined
        >;

        const featuredCategoriesPromises =
          camelCasedSettings.featuredCategories?.map(featured =>
            client
              .getFeaturedCategory({ slug: featured.category.slug })
              .then(({ data: { categoryBySlug: featured } }) => {
                return {
                  href: `/categories/${featured?.slug}`,
                  title: featured?.name ?? '',
                  id: generateId(),
                  image: {
                    alt: featured?.images?.[0]?.caption ?? '',
                    src: featured?.images?.[0]?.file?.url ?? '',
                    height: featured?.images?.[0]?.file?.height ?? 0,
                    width: featured?.images?.[0]?.file?.width ?? 0,
                  },
                };
              }),
          ) ?? [];

        const featuredCategories = await Promise.all(
          featuredCategoriesPromises,
        );

        if (!mounted) return;

        setLiveSettings({ ...camelCasedSettings, featuredCategories });
      } else if (details.path?.startsWith?.('content.featured_categories')) {
        if (!details.value.category) return;

        const slug = details.value.category.slug;

        const {
          data: { categoryBySlug: category },
        } = await client.getFeaturedCategory({ slug });

        if (!category || !mounted) return;

        const index = Number(
          details.path.slice(
            'content.featured_categories.'.length,
            details.path.length,
          ),
        );

        setLiveSettings(prevValue => {
          const newFeaturedCategory = {
            href: `/categories/${category.slug}`,
            title: category.name ?? '',
            id: generateId(),
            image: {
              alt: category.images?.[0]?.caption ?? '',
              src: category.images?.[0]?.file?.url ?? '',
              height: category.images?.[0]?.file?.height ?? 0,
              width: category.images?.[0]?.file?.width ?? 0,
            },
          };

          const newFeaturedCategories = [
            ...(prevValue.featuredCategories ?? []),
          ];
          newFeaturedCategories[index] = newFeaturedCategory;

          return {
            ...prevValue,
            featuredCategories: newFeaturedCategories,
          };
        });
      }
    };

    window.addEventListener('message', handler);

    return () => {
      window.removeEventListener('message', handler);
      mounted = false;
    };
  }, []);

  const filterCns = cn('border-dividers min-w-[160px] text-sm md:text-lg');

  return (
    <article
      className={cn(
        'mb-6 lg:mb-12',
        'lg:pt-32 relative min-h-screen',
        SECTION_PADDING_MAP[SPACING.SMALL],
      )}>
      {/* Mobile filters modal toggle */}
      <Button
        elType={BUTTON_TYPE.BUTTON}
        buttonStyle={BUTTON_STYLE.SECONDARY}
        hasBorder={false}
        small
        onClick={() => setMobileFiltersOpen(true)}
        className="fixed bottom-5 left-1/2 z-10 -translate-x-1/2 rounded-full px-4 lg:hidden">
        <span className="flex gap-2 text-md normal-case">
          <InlineIcon height={24} width={24} icon="system-uicons:filtering" />
          Filter
        </span>
      </Button>

      <Breadcrumb
        className="mt-1 mb-6 lg:mt-8 lg:px-0"
        customText={breadcrumbText}
      />

      {/* Featured categories */}
      {liveSettings.showFeaturedCategories &&
      !!liveSettings.featuredCategories?.length ? (
        <>
          <CategoriesPreview
            className="pl-6 lg:max-w-none lg:pl-0 xl:mx-0"
            columns={3}
            items={liveSettings.featuredCategories}
          />
          <hr className="mt-4 hidden w-full bg-dividers lg:block" />
        </>
      ) : null}

      <div className="mt-4 flex flex-col">
        {/* Filters list: */}
        {/* Mobile */}
        <Transition show={mobileFiltersOpen} as={Fragment}>
          <Dialog className="fixed z-modal lg:hidden" onClose={closeFilters}>
            <Transition.Child
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              className="fixed inset-0 -z-10 w-screen bg-[#0008] transition-opacity duration-400"
              as="button"
              onClick={closeFilters}
            />
            <Transition.Child
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
              className="fixed right-0 top-0 flex h-screen w-screen max-w-[22rem] flex-col bg-background-black transition-transform duration-400">
              <div className="flex flex-1 flex-col overflow-auto px-6 pb-6">
                <div className="flex items-center justify-between py-4 text-white">
                  <div className="flex gap-4">
                    <span className="text-md font-semibold uppercase">
                      Filters
                    </span>
                  </div>
                  <button onClick={closeFilters}>
                    <Close width={20} height={20} />
                  </button>
                </div>
                <ul className="flex w-full flex-col">
                  {attributeFilters.map(filter => (
                    <li className="border-b border-dividers" key={filter.name}>
                      <GenericAccordion
                        // Force re-render of the component client-side to have the defaultOpen state match the query parameters
                        key={typeof activeFilters === 'undefined' ? 1 : 2}
                        defaultOpen={
                          !!activeFilters?.some(
                            filterState => filterState.group === filter.id,
                          )
                        }
                        className={'text-white'}
                        name={filter.name}>
                        <ul className="flex flex-col gap-2 pb-4">
                          {filter.values.map(option => (
                            <li key={option.label}>
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  onChange={e =>
                                    onCheckboxChange(e, option, filter)
                                  }
                                  checked={activeFilters?.some(
                                    filterState =>
                                      filterState.group === filter.id &&
                                      filterState.values.has(option.value),
                                  )}
                                  label={option.label}
                                />
                                <span>{option.label}</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </GenericAccordion>
                    </li>
                  ))}
                  <li className="border-b border-dividers">
                    <GenericAccordion
                      // Force re-render of the component client-side to have the defaultOpen state match the query parameters
                      key={typeof activeFilters === 'undefined' ? 1 : 2}
                      defaultOpen={new URLSearchParams(
                        typeof window !== 'undefined'
                          ? window.location.search
                          : '',
                      ).has('price')}
                      className={'text-white'}
                      name="Price">
                      <div>
                        <div className="flex w-full justify-between text-white">
                          <span>
                            {formatPrice(
                              Math.max(
                                priceRangeValue?.[0] ?? 0,
                                priceRangeLimits[0],
                              ),
                            )}
                          </span>
                          <span>
                            {formatPrice(
                              Math.min(
                                priceRangeValue?.[1] ?? priceRangeLimits[1],
                                priceRangeLimits[1],
                              ),
                            )}
                          </span>
                        </div>
                        <Range
                          min={priceRangeLimits[0]}
                          max={priceRangeLimits[1]}
                          onChange={onPriceRangeChange}
                          value={priceRangeValue ?? priceRangeLimits}
                          label="Price range"
                          thumbClassName={'bg-white'}
                        />
                      </div>
                    </GenericAccordion>
                  </li>
                </ul>
              </div>

              <div className="sticky bottom-0 flex flex-col gap-6 bg-background-black p-6 shadow-3xl">
                <ul className="flex flex-wrap items-center gap-2">
                  {activeFilters?.map(filter =>
                    Array.from(filter.values).map(value => (
                      <li key={value}>
                        <Tag className="flex items-center gap-2" secondary>
                          {value}{' '}
                          <button
                            onClick={() => {
                              const attrFilter = attributeFilters.find(
                                attr => attr.id === filter.group,
                              );

                              if (!attrFilter) return;

                              onUncheck(value, attrFilter);
                            }}>
                            <Close width={10} height={10} />
                          </button>
                        </Tag>
                      </li>
                    )),
                  )}
                  <li>
                    {!!activeFilters?.length && (
                      <button
                        className="text-xs font-semibold text-black"
                        onClick={() => onFiltersChange([])}>
                        {/* TODO: i8n */}
                        Remove all
                      </button>
                    )}
                  </li>
                </ul>

                <Button
                  elType={BUTTON_TYPE.BUTTON}
                  className="text-center uppercase"
                  onClick={closeFilters}
                  fullWidth>
                  {/* TODO: i8n */}
                  See results ({products?.length || 0})
                </Button>
              </div>
            </Transition.Child>
          </Dialog>
        </Transition>

        {/* Desktop */}
        <aside className="hidden lg:block absolute top-0 left-0 w-full">
          <ul
            className={cn(
              'flex shrink-0 gap-14 items-center bg-gray-100 h-20',
              SECTION_PADDING_MAP[SPACING.SMALL],
            )}>
            <li className="shrink-0 flex-grow">
              <Input
                value={searchTerm}
                onChange={onSearchTermChange}
                placeholder={placeholderLabel}
                icon="material-symbols:search-rounded"
                className="flex-auto"
                small
              />
            </li>
            <li>
              <Link
                href="/products"
                scroll={false}
                className={cn(
                  'text-black px-2 border-b-[1.5px] hover:border-black',
                  {
                    // If the category is active, show it as bold
                    'font-semibold': pathname === '/products',
                    'border-black': pathname === '/products',
                    'border-transparent': pathname !== '/products',
                  },
                )}>
                {/* If the current route is /products, show it as bold */}
                Show ALL
              </Link>
            </li>
            {categories.map(category => (
              <li key={category.slug}>
                <Link
                  href={`/categories/${category.slug}`}
                  scroll={false}
                  onClick={() => {
                    setLoading(true);
                    setPriceRangeValue(undefined);
                  }}
                  className={cn(
                    'text-black px-2 border-b-[1.5px] hover:border-black',
                    {
                      // If the category is active, show it as bold
                      'font-semibold':
                        category.slug === searchParams.get('slug'),
                      'border-black':
                        category.slug === searchParams.get('slug'),
                      'border-transparent':
                        category.slug !== searchParams.get('slug'),
                    },
                  )}>
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>

          <ul
            className={cn(
              'flex w-full shrink-0 border-dividers bg-transparent z-20 overflow-hidden',
              SECTION_PADDING_MAP[SPACING.SMALL],
            )}>
            <li className={cn('flex pt-4 pr-10', filterCns)}>
              <TextBody
                content="Filters"
                className="text-gray-400 font-semibold"
              />
            </li>
            {attributeFilters.map(filter => (
              <li className={filterCns} key={filter.name}>
                <GenericAccordion
                  // Force re-render of the component client-side to have the defaultOpen state match the query parameters
                  key={typeof activeFilters === 'undefined' ? 1 : 2}
                  defaultOpen={
                    !!activeFilters?.some(
                      filterState => filterState.group === filter.id,
                    )
                  }
                  name={
                    filter.name.charAt(0).toUpperCase() + filter.name.slice(1)
                  }
                  className="pl-2"
                  hideArrow>
                  <ul className="flex flex-col gap-2 pb-4 bg-white z-10 relative px-2 -ml-2">
                    {filter.values.map(option => (
                      <li key={option.label}>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={option.value}
                            onChange={e => onCheckboxChange(e, option, filter)}
                            checked={activeFilters?.some(
                              filterState =>
                                filterState.group === filter.id &&
                                filterState.values.has(option.value),
                            )}
                            label={option.label}
                          />
                          <span>{option.label}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </GenericAccordion>
              </li>
            ))}
            <li className={filterCns}>
              <GenericAccordion
                // Force re-render of the component client-side to have the defaultOpen state match the query parameters
                key={typeof activeFilters === 'undefined' ? 1 : 2}
                defaultOpen={new URLSearchParams(
                  typeof window !== 'undefined' ? window.location.search : '',
                ).has('price')}
                name="Price"
                hideArrow>
                <div>
                  <div className="flex w-full justify-between text-black">
                    <span>
                      {formatPrice(
                        Math.max(
                          priceRangeValue?.[0] ?? 0,
                          priceRangeLimits[0],
                        ),
                      )}
                    </span>
                    <span>
                      {formatPrice(
                        Math.min(
                          priceRangeValue?.[1] ?? priceRangeLimits[1],
                          priceRangeLimits[1],
                        ),
                      )}
                    </span>
                  </div>
                  <Range
                    min={priceRangeLimits[0]}
                    max={priceRangeLimits[1]}
                    onChange={onPriceRangeChange}
                    value={priceRangeValue ?? priceRangeLimits}
                    label="Price range"
                    thumbClassName={'bg-black'}
                  />
                </div>
              </GenericAccordion>
            </li>
          </ul>
        </aside>

        <section className="w-full">
          <ProductCount count={products.length} className="lg:px-0" />
          {/* Products list */}
          <ul
            className={cn(
              'mt-4 grid w-full grid-cols-2 gap-y-8 gap-x-4 lg:mt-6 lg:gap-x-8 lg:gap-y-10 lg:px-0',
              {
                'lg:grid-cols-2': Number(liveSettings.productsPerRow) === 2,
                'lg:grid-cols-3': Number(liveSettings.productsPerRow) === 3,
                'lg:grid-cols-4': Number(liveSettings.productsPerRow) === 4,
                'lg:grid-cols-5': Number(liveSettings.productsPerRow) === 5,
              },
            )}>
            {loading || isSearching
              ? Array(16)
                  .fill(0)
                  .map((_, i) => (
                    <li key={i}>
                      <ProductPreviewCard loading />
                    </li>
                  ))
              : products.map(product => (
                  <li key={product.id}>
                    <ProductPreviewCard
                      className="animate-fade-in duration-75"
                      product={{
                        ...product,
                        hasQuickAdd:
                          product.hasQuickAdd && liveSettings.enableQuickAdd,
                      }}
                      show_product_price={liveSettings.showProductsPrice}
                      show_product_description={!isMobile}
                    />
                  </li>
                ))}
          </ul>
        </section>
      </div>
    </article>
  );
};

export default ProductsLayout;
