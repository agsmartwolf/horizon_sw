import React, { useMemo, useRef } from 'react';
import Image from 'components/atoms/SafeImage';
import Price from 'components/atoms/Price';
import Link from 'next/link';

import type { PurchasableProductData } from 'types/shared/products';
import useProductSelection from 'hooks/useProductSelection';
import QuickAdd from './QuickAdd';
import useI18n from '../../../hooks/useI18n';
import GenericTag, { getTagTypeByName } from '../GenericTag';
import { useDisplayedTags } from '../../../hooks/useDisplayedTags';

export interface ProductPreviewCardPurchasableProps
  extends React.HTMLAttributes<HTMLDivElement> {
  product: PurchasableProductData;
  fromPriceLabel?: string;
  show_product_price?: boolean;
  show_product_description?: boolean;
}

const ProductPreviewCardPurchasable: React.FC<
  ProductPreviewCardPurchasableProps
> = ({
  product,
  fromPriceLabel = '',
  show_product_price = true,
  show_product_description = true,
  ...props
}) => {
  const {
    description,
    image,
    price,
    origPrice,
    title,
    href,
    productOptions,
    productVariants,
    purchaseOptions,
    id: productId,
    tags = [],
  } = product;

  const wrapperRef = useRef(null);
  const { state, dispatch, addToCart, activeVariation } = useProductSelection({
    productId,
    productOptions,
    purchaseOptions,
    productVariants,
    shouldPreselectOption: false,
  });

  const [activePrice, activeOrigPrice] = useMemo(() => {
    return [
      activeVariation?.price ?? price,
      activeVariation?.origPrice ?? origPrice,
    ];
  }, [activeVariation, origPrice, price]);

  const i18n = useI18n();

  const addToBagLabel =
    i18n('products.preview.quick_add.add_to_cart') || 'Add to bag';
  const addedToBagLabel =
    i18n('products.preview.quick_add.added') || 'Added to bag';
  const nextLabel = i18n('products.preview.quick_add.next') || 'Next';
  const quickAddLabel =
    i18n('products.preview.quick_add.quick_add') || 'Quick add';

  const containerClassNames =
    'relative flex flex-col gap-4 overflow-visible text-black lg:min-w-0 bg-white  border-[1px] border-gray-100 cursor-pointer';

  const displayedTags = useDisplayedTags(tags);

  return (
    <div
      {...props}
      className={[containerClassNames, props.className].join(' ')}>
      <QuickAdd
        {...product}
        stockLevel={product.stockLevel}
        productOptions={productOptions}
        state={state}
        dispatch={dispatch}
        addToCart={addToCart}
        focusOnRef={wrapperRef}
        className="safe-aspect-square relative overflow-hidden bg-white"
        hoverableElement={p => (
          <Link {...p} href={href}>
            <Image
              src={image.src}
              alt={image?.alt}
              className={`${image?.className ?? ''}`}
              sizes={'33vw'}
              style={{
                position: 'absolute',
                width: '100%',
                top: 0,
                left: 0,
                height: '100%',
                objectFit: 'contain',
              }}
            />
          </Link>
        )}
        addToBagLabel={addToBagLabel}
        addedToBagLabel={addedToBagLabel}
        nextLabel={nextLabel}
        quickAddLabel={quickAddLabel}
      />
      <Link href={href} className="cursor-pointer">
        <div className="md:min-h-[100px] lg:min-h-[116px] bg-gray-200 px-2.5 py-2.5 lg:p-5">
          <div className={'flex flex-col md:flex-row justify-between'}>
            <h4
              className="text-md font-medium md:font-bold lg:text-sm mb-2 block truncate"
              title={title}>
              {title}
            </h4>
            {show_product_price && (
              <div className="text-lg font-semibold lg:text-sm">
                {fromPriceLabel ? `${fromPriceLabel} ` : ''}
                <Price price={activePrice} origPrice={activeOrigPrice} />
              </div>
            )}
          </div>
          <div className="flex flex-col lg:pr-2" ref={wrapperRef}>
            {show_product_description && (
              <span
                className="text-sm text-body line-clamp-2"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}
          </div>
        </div>
      </Link>
      {displayedTags?.map(tag => {
        if (!tag) return null;
        const type = getTagTypeByName(tag);
        return type ? (
          <GenericTag tag={type} key={tag}>
            {tag}
          </GenericTag>
        ) : null;
      })}
    </div>
  );
};

export default ProductPreviewCardPurchasable;
