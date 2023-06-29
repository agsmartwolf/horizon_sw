import React, { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import type { GetStaticPaths, GetStaticProps } from 'next';
import useProductSelection, { ACTIONS } from 'hooks/useProductSelection';
import useProductStock from 'hooks/useProductStock';
import cn from 'classnames';
import ProductBenefits from 'components/molecules/ProductBenefits';
import PurchaseOptionsRadio from 'components/atoms/PurchaseOptionsRadio';
import SubscriptionOptions from 'components/molecules/SubscriptionOptions';
// import CounterInput from 'components/atoms/CounterInput/CounterInput';
import Button from 'components/atoms/Button';
import Price from 'components/atoms/Price';
import UpSell from 'components/molecules/UpSell';
import ImageGallery from 'components/molecules/ImageGallery';
import InfoAccordion from 'components/molecules/InfoAccordion';
import ProductHeader, {
  ProductHeaderProps,
} from 'components/molecules/ProductHeader';
import getGQLClient from 'lib/graphql/client';
import { getProductBySlug } from 'lib/shop/fetchingFunctions';
import type { MandatoryImageProps } from 'types/global';
import { BUTTON_STYLE, BUTTON_TYPE } from 'types/shared/button';
import {
  ProductOption,
  PURCHASE_OPTION_TYPE,
  STOCK_STATUS,
} from 'types/shared/products';
import type {
  SwellProduct,
  SwellProductContentExpandableDetail,
  SwellProductPurchaseOptions,
  SwellProductUpSell,
  SwellProductVariant,
} from 'lib/graphql/generated/sdk';
import type { ProductBenefitProps } from 'components/atoms/ProductBenefit';
import useCurrencySubscription from 'hooks/useCurrencySubscription';
import ProductOptions from 'components/organisms/ProductOptions';
import useCurrency from 'stores/currency';
import { withMainLayout } from 'lib/utils/fetch_decorators';
import type { ParsedUrlQuery } from 'querystring';
import StatusIndicator from 'components/atoms/StatusIndicator';
import useI18n from 'hooks/useI18n';
import { SECTION_PADDING_MAP, SPACING } from '../../lib/globals/sizings';
import {
  addStockOptionData,
  getColorOptionArrayIds,
} from '../../lib/utils/products';
import GenericTag, {
  getTagTypeByName,
} from '../../components/atoms/GenericTag';
import { useDisplayedTags } from '../../hooks/useDisplayedTags';
import styles from 'styles/products.module.css';
import CollapsableText from '../../components/atoms/CollapsableText';
import TextHeading from '../../components/atoms/Text/TextHeading';
import SEO from '../../components/atoms/SEO';
import Table from '../../components/atoms/Table';
import GenericAccordion from '../../components/atoms/GenericAccordion';
import { useProductSizeOptionUpdating } from '../../hooks/useProductSizeOptionUpdating';
import { useProductUpsell } from '../../hooks/useProductUpsell';

export enum LAYOUT_ALIGNMENT {
  STANDARD = 'standard',
  LEFT_ALIGNED = 'left_aligned',
}

interface ProductSettings {
  calloutTitle: string | null;
  calloutDescription: string | null;
  showStockLevels: boolean;
  layoutOptions: LAYOUT_ALIGNMENT;
  enableProductCounter: boolean;
  lowStockIndicator: number | null;
}

export interface ProductsPageProps {
  slug: string;
  productId: string;
  isGiftCard: boolean;
  currency: string;
  images: MandatoryImageProps[];
  details: ProductHeaderProps;
  productOptions: ProductOption[];
  productBenefits: ProductBenefitProps[];
  expandableDetails: SwellProductContentExpandableDetail[];
  purchaseOptions: SwellProductPurchaseOptions;
  productVariants: SwellProductVariant[];
  upSells: SwellProductUpSell[];
  // upSells: PurchasableProductData[];
  stockLevel: SwellProduct['stockLevel'];
  stockPurchasable: SwellProduct['stockPurchasable'];
  stockTracking: SwellProduct['stockTracking'];
  settings: ProductSettings;
  tags: Array<string | null>;
  meta: {
    title: string;
    description: string;
  };
  colorOptionId?: string;
  sizeChart?: string[][];
}

export const getStaticPaths: GetStaticPaths = async ({
  locales,
  defaultLocale,
}) => {
  const client = getGQLClient();
  const response = await client.getProductSlugs();
  const { products: productsQueryResults } = response.data;

  const paths: { params: ParsedUrlQuery; locale?: string }[] = [];

  productsQueryResults?.results?.forEach(product => {
    if (product?.slug) {
      const localesArray = locales?.length ? locales : [defaultLocale];
      localesArray?.forEach(locale => {
        paths.push({ params: { slug: product.slug as string }, locale });
      });
    }
  });

  return {
    paths,
    fallback: 'blocking',
  };
};

const propsCallback: GetStaticProps<ProductsPageProps> = async context => {
  if (!context.params?.slug || typeof context.params?.slug !== 'string') {
    return {
      notFound: true,
    };
  }

  const client = getGQLClient();
  const {
    data: { storeSettings },
  } = await client.getStoreSettings();

  const { locale } = context;
  const currency = storeSettings?.store?.currency || undefined;

  const productData = await getProductBySlug(context.params.slug, {
    currency,
    locale,
  });

  const colorOption = productData.productOptions.find(option =>
    getColorOptionArrayIds(option).includes('color'),
  );

  return {
    props: {
      ...productData,
      ...(locale ? { locale } : {}),
      colorOptionId: colorOption?.id ?? '',
    },
  };
};

export const getStaticProps = withMainLayout(propsCallback);

const ProductsPage: React.FC<ProductsPageProps> = ({
  slug,
  productId,
  isGiftCard,
  images,
  currency: currencyProp,
  details,
  productBenefits,
  expandableDetails,
  productOptions: productOptionsProp,
  purchaseOptions: purchaseOptionsProp,
  productVariants: productVariantsProp,
  upSells: upSellsProp,
  stockLevel,
  stockPurchasable,
  stockTracking,
  settings,
  meta,
  tags,
  colorOptionId,
  sizeChart,
}) => {
  const { locale } = useRouter();
  const i18n = useI18n();

  const detailsLabel = i18n('products.details');
  const sizeChartLabel = i18n('products.sizeChart');
  const addLabel = i18n('products.add_to_cart');
  const upsellsTitle = i18n('products.upsells.title');

  const [liveSettings] = useState(settings);
  const [isProductLoading, setIsProductLoading] = useState(false);
  const defaultCurrencySubscriptionData = useMemo(
    () => ({
      currency: currencyProp,
      productOptions: productOptionsProp,
      purchaseOptions: purchaseOptionsProp,
      productVariants: productVariantsProp,
      upSells: upSellsProp,
    }),
    [
      currencyProp,
      productOptionsProp,
      purchaseOptionsProp,
      productVariantsProp,
      upSellsProp,
    ],
  );

  const currencySubscriptionCallback = useCallback(
    async (newCurrency: string) => {
      setIsProductLoading(true);
      const r = await getProductBySlug(slug, {
        currency: newCurrency,
        locale,
        skipTriggeringGlobalLoading: true,
      });
      setIsProductLoading(false);
      return r;
    },
    [locale, slug],
  );

  const currencyGetter = useCallback(
    (data: typeof defaultCurrencySubscriptionData) => data.currency,
    [],
  );

  const {
    currencySubscriptionDataFetched,
    productOptions,
    purchaseOptions,
    productVariants,
  } = useCurrencySubscription({
    defaultData: defaultCurrencySubscriptionData,
    callback: currencySubscriptionCallback,
    currencyGetter,
  });
  const formatPrice = useCurrency(store => store.formatPrice);

  const upSells = useProductUpsell({
    productUpSell: upSellsProp,
    currency: defaultCurrencySubscriptionData.currency,
    locale,
    isFetchAllowed: currencySubscriptionDataFetched,
  });

  const { state, dispatch, activeVariation, addToCart } = useProductSelection({
    productId,
    productOptions,
    purchaseOptions,
    productVariants,
    isGiftCard,
    stockLevel,
  });
  const standardPriceTotal = activeVariation?.standardPrice?.price
    ? activeVariation?.standardPrice?.price * state.quantity
    : 0;
  const subscriptionPriceTotal = activeVariation?.subscriptionPrice?.price
    ? activeVariation?.subscriptionPrice?.price * state.quantity
    : 0;
  const origStandardPriceTotal = activeVariation?.standardPrice?.origPrice
    ? activeVariation?.standardPrice?.origPrice * state.quantity
    : undefined;
  const origSubscriptionPriceTotal = activeVariation?.subscriptionPrice
    ?.origPrice
    ? activeVariation?.subscriptionPrice?.origPrice * state.quantity
    : undefined;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [stockStatus, _maxQuantity] = useProductStock({
    stockTracking,
    stockLevel: activeVariation?.stockLevel,
    stockPurchasable,
    lowStockIndicator: liveSettings.lowStockIndicator,
    activeVariation,
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    addToCart();
  }

  const imageSectionClasses = cn(
    'mt-10 relative',
    SECTION_PADDING_MAP[SPACING.MEDIUM],
  );

  const handleChangeCurrentImage = (n: MandatoryImageProps) => {
    if (n.colorId && colorOptionId) {
      dispatch({
        type: ACTIONS.SET_SELECTED_PRODUCT_OPTIONS,
        payload: { optionId: colorOptionId, valueId: n.colorId },
      });
    }
  };

  const displayedTags = useDisplayedTags(tags, stockLevel);

  useProductSizeOptionUpdating({
    colorOptionId,
    productOptions,
    productVariants,
    purchaseOptions,
    stockLevel,
    state,
    dispatch,
  });

  return (
    <div>
      <SEO
        title={meta.title}
        description={meta.description}
        locale={locale}
        image={images[0]}
      />
      <article className="flex flex-col lg:grid lg:grid-cols-2 mb-4">
        <section className={imageSectionClasses}>
          <ImageGallery
            images={images}
            aspectRatio={
              images[0] ? `${images[0].width}/${images[0].height}` : '12/10'
            }
            handleChangeCurrentImage={handleChangeCurrentImage}
            selectedColorId={state.selectedProductOptions.get(
              colorOptionId ?? '',
            )}
          />
          {displayedTags?.map(tag => {
            if (!tag) return null;
            const type = getTagTypeByName(tag);
            return type ? (
              <GenericTag
                tag={type}
                key={tag}
                className={`z-20 ${styles.GenericTag}`}>
                {tag}
              </GenericTag>
            ) : null;
          })}
        </section>
        <aside className="mt-10 lg:px-14">
          <div className="px-6">
            <ProductHeader {...details} tags={tags} />
            {!!productBenefits.length && (
              <ProductBenefits benefits={productBenefits} className="mt-10" />
            )}
            <form onSubmit={handleSubmit} className="flex flex-col mb-5">
              {!!productOptions.length && (
                <ProductOptions
                  updating={isProductLoading}
                  options={addStockOptionData(
                    productOptions,
                    state.selectedProductOptions,
                    purchaseOptions,
                    productVariants,
                    stockLevel,
                  )}
                  selectedOptions={state.selectedProductOptions}
                  onChange={payload => dispatch(payload)}
                  isGiftCard={isGiftCard}
                  priceFormatter={formatPrice}
                />
              )}
              {liveSettings.showStockLevels && !!stockStatus ? (
                <div className="self-start">
                  <StatusIndicator
                    status={stockStatus}
                    type="stock"
                    payload={activeVariation?.stockLevel?.toString()}
                  />
                </div>
              ) : (
                <div className="mt-4" />
              )}

              {purchaseOptions?.standard && purchaseOptions?.subscription && (
                <PurchaseOptionsRadio
                  standardPrice={activeVariation?.standardPrice}
                  subscriptionPrice={activeVariation?.subscriptionPrice}
                  value={state.selectedPurchaseOption}
                  onChange={purchaseOption =>
                    dispatch({
                      type: ACTIONS.SET_SELECTED_PURCHASE_OPTION,
                      payload: purchaseOption,
                    })
                  }
                  className="mt-4"
                />
              )}
              {state.selectedPurchaseOption ===
                PURCHASE_OPTION_TYPE.SUBSCRIPTION && (
                <SubscriptionOptions
                  plans={purchaseOptions.subscription?.plans}
                  value={state.selectedPlan}
                  onChange={plan =>
                    dispatch({
                      type: ACTIONS.SET_SELECTED_PLAN,
                      payload: plan,
                    })
                  }
                  className="mt-4"
                />
              )}
              {sizeChartLabel && sizeChart?.length ? (
                <>
                  <GenericAccordion
                    name={sizeChartLabel}
                    defaultOpen={false}
                    className={'relative'}
                    arrowClassName={'absolute right-[-20px]'}>
                    <TextHeading
                      content={sizeChartLabel}
                      className="mb-4"
                      size={3}
                    />
                    <Table data={sizeChart} className={'w-full'} />
                  </GenericAccordion>
                </>
              ) : null}

              <div className="mt-4 inline-grid grid-cols-3 gap-2">
                <Button
                  className={'col-span-3 md:col-span-2'}
                  buttonStyle={BUTTON_STYLE.SECONDARY}
                  elType={BUTTON_TYPE.BUTTON}
                  fullWidth
                  type="submit"
                  disabled={stockStatus === STOCK_STATUS.OUT_OF_STOCK}>
                  <p>
                    {`${addLabel} - `}
                    {state.selectedPurchaseOption ===
                    PURCHASE_OPTION_TYPE.SUBSCRIPTION ? (
                      <Price
                        price={subscriptionPriceTotal}
                        origPrice={origSubscriptionPriceTotal}
                      />
                    ) : (
                      <Price
                        price={standardPriceTotal}
                        origPrice={origStandardPriceTotal}
                      />
                    )}
                  </p>
                </Button>
                {/*{liveSettings.enableProductCounter && (
                  <CounterInput
                    className="col-span-1 justify-between"
                    value={state.quantity}
                    onChange={quantity =>
                      dispatch({
                        type: ACTIONS.SET_QUANTITY,
                        payload: quantity,
                      })
                    }
                    min={1}
                    max={maxQuantity}
                  />
                )}*/}
              </div>
            </form>
            {!!expandableDetails.length && (
              <div className="flex w-full flex-col gap-2 py-8">
                {expandableDetails.map(detail => (
                  <InfoAccordion
                    className="w-full"
                    key={detail.id}
                    content={detail.details ?? ''}
                    label={detail.label ?? ''}
                    accordionStyle="default"
                  />
                ))}
              </div>
            )}

            {detailsLabel && details.description && (
              <>
                <TextHeading
                  content={detailsLabel}
                  className="mt-10 mb-4"
                  size={3}
                />
                <CollapsableText text={details.description} />
              </>
            )}
          </div>
        </aside>
      </article>
      {!!upSells?.length && (
        <div className="">
          <h4 className="pt-6 pl-6 font-headings text-2xl font-semibold text-black lg:py-10 lg:pl-14">
            {upsellsTitle}
          </h4>

          <UpSell items={upSells} />
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
