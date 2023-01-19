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
    'relative flex flex-col gap-4 overflow-visible text-black lg:min-w-0 bg-white  border-[1px] border-gray-100 cursor-pointer';

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
        addToBagLabel="Add to bag"
        addedToBagLabel="Added to bag"
        nextLabel="Next"
      />
      <Link href={href} className="cursor-pointer">
        <div className="flex flex-col md:flex-row px-2.5 py-2.5 lg:p-5 bg-gray-200">
          <div className="flex flex-col lg:pr-2" ref={wrapperRef}>
            <h4 className="text-md font-medium md:font-bold lg:text-sm mb-2 block truncate">
              {title}
            </h4>
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
      </Link>
    </div>
  );
};

export default ProductPreviewCardPurchasable;
