import React, { useMemo, useRef } from 'react';
import Image from 'components/atoms/SafeImage';
import Price from 'components/atoms/Price';
import Link from 'next/link';

import type { PurchasableProductData } from 'types/shared/products';
import useProductSelection from 'hooks/useProductSelection';
import QuickAdd from './QuickAdd';

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

  const containerClassNames =
    'relative flex flex-col gap-4 overflow-visible text-black lg:min-w-0 bg-gray-100';

  return (
    <div
      {...props}
      className={[containerClassNames, props.className].join(' ')}>
      <QuickAdd
        productOptions={productOptions}
        state={state}
        dispatch={dispatch}
        addToCart={addToCart}
        focusOnRef={wrapperRef}
        className="safe-aspect-square relative overflow-hidden lg:pb-[125%] bg-gray-200"
        hoverableElement={props => (
          <Link {...props} href={href}>
            <Image
              {...image}
              alt={image?.alt}
              className={`${image?.className ?? ''}`}
              fill
            />
          </Link>
        )}
        addToBagLabel="Add to bag"
        addedToBagLabel="Added to bag"
        nextLabel="Next"
      />

      <div className={'px-5 py-5 lg:px-10'}>
        <div className="flex flex-col" ref={wrapperRef}>
          <Link href={href}>
            <h4 className="font-headings text-md font-semibold line-clamp-2 lg:text-sm">
              {title}
            </h4>
          </Link>
          {show_product_description && (
            <span
              className="text-sm text-body line-clamp-2"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
        </div>
        {show_product_price && (
          <div className="text-lg font-semibold lg:text-sm">
            {fromPriceLabel}
            <Price price={activePrice} origPrice={activeOrigPrice} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPreviewCardPurchasable;
