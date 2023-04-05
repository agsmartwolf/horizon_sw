import React from 'react';
import Image from 'components/atoms/SafeImage';
import Price from 'components/atoms/Price';
import Link from 'next/link';

import type { ProductData } from 'types/shared/products';
import styles from './ProductPreview.module.css';
import GenericTag, { getTagTypeByName } from '../GenericTag';
import { useDisplayedTags } from '../../../hooks/useDisplayedTags';
import { useViewport } from '../../../hooks/useViewport';

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
  const {
    descriptionShort = '',
    image,
    price,
    origPrice,
    title,
    href = '#',
    tags = [],
  } = product;

  const { isMobile } = useViewport();
  const displayedTags = useDisplayedTags(tags);

  const containerClassNames =
    'relative flex flex-col gap-4 overflow-visible text-black lg:min-w-0 bg-white  border-[1px] border-gray-100 cursor-pointer';

  return (
    <div
      {...props}
      className={[containerClassNames, props.className].join(' ')}>
      <Link href={href} className="cursor-pointer">
        <div className="safe-aspect-square relative overflow-hidden bg-white">
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
        <div className="md:min-h-[100px] lg:min-h-[116px] bg-gray-200 px-2.5 py-2.5 lg:p-5">
          <div className={'flex flex-col md:flex-row justify-between'}>
            <h4
              className="text-md font-medium md:font-bold lg:text-sm mb-2 block truncate"
              title={title}>
              {title}
            </h4>
            {price && show_product_price && (
              <div className="text-md font-semibold lg:text-sm">
                {fromPriceLabel ? `${fromPriceLabel} ` : ''}
                <Price price={price} origPrice={origPrice} />
              </div>
            )}
          </div>
          <div className="flex flex-col lg:pr-2">
            {show_product_description && (
              <span
                className={`text-sm text-body line-clamp-2 ${styles.innerContent}`}
                dangerouslySetInnerHTML={{ __html: descriptionShort }}
              />
            )}
          </div>
        </div>
      </Link>
      {displayedTags?.map(tag => {
        if (!tag) return null;
        const type = getTagTypeByName(tag);
        return type ? (
          <GenericTag
            tag={type}
            key={tag}
            customPositioning={isMobile && show_product_description}
            className={
              show_product_description && isMobile
                ? 'bottom-[120px] right-[0] sm:right-[10px] sm:top-[10px] sm:bottom-[unset]'
                : ''
            }>
            {tag}
          </GenericTag>
        ) : null;
      })}
    </div>
  );
};

export default ProductPreviewCardSimple;
