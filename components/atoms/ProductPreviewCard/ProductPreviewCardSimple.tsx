import React from 'react';
import Image from 'components/atoms/SafeImage';
import Price from 'components/atoms/Price';
import Link from 'next/link';

import type { ProductData } from 'types/shared/products';

export interface ProductPreviewCardSimpleProps
  extends React.HTMLAttributes<HTMLDivElement> {
  product: ProductData;
  fromPriceLabel?: string;
  show_product_price?: boolean;
  show_product_description?: boolean;
}

const ProductPreviewCardSimple: React.FC<ProductPreviewCardSimpleProps> = ({
  product,
  fromPriceLabel = '',
  show_product_price = true,
  show_product_description = true,
  ...props
}) => {
  const { description, image, price, origPrice, title, href = '#' } = product;

  const containerClassNames =
    'relative flex flex-col gap-4 overflow-visible text-black lg:min-w-0 bg-white border-[1px] border-gray-100';

  return (
    <div
      {...props}
      className={[containerClassNames, props.className].join(' ')}>
      <Link href={href} className="bg-white">
        <div className="safe-aspect-square relative overflow-hidden">
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
        </div>
      </Link>
      <div
        className={'flex flex-col md:flex-row px-5 py-5 lg:px-10 bg-gray-200'}>
        <div className="flex flex-col lg:pr-2">
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
        {price && show_product_price && (
          <div className="text-md font-semibold lg:text-sm">
            {fromPriceLabel}
            <Price price={price} origPrice={origPrice} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPreviewCardSimple;
