import React from 'react';
import Image from 'components/atoms/SafeImage';
import Link from 'next/link';

import Price from 'components/atoms/Price';
import RichText from 'components/atoms/RichText';
import type { ProductData } from 'types/shared/products';

export interface ProductDisplayProps
  extends React.HTMLAttributes<HTMLDivElement> {
  product: ProductData;
}

const ProductDisplay: React.FC<ProductDisplayProps> = ({
  product,
  ...props
}) => {
  const { title, description, href, price, image } = product;

  const containerClassNames = 'flex flex-col gap-4 overflow-visible text-black';

  return (
    <div
      {...props}
      className={[containerClassNames, props.className].join(' ')}>
      <Link href={href} className="safe-aspect-4-3 relative overflow-hidden">
        <Image
          {...image}
          
          alt={image.alt}
          className={`rounded-image ${image.className}`}
          objectFit="cover"
        />
      </Link>
      <div className="flex flex-col space-y-1">
        <Link href={href}>
          <h4 className="font-headings text-md font-semibold text-black line-clamp-2">
            {title}
          </h4>
        </Link>
        {!!description && (
          <RichText
            className="block text-sm text-body line-clamp-2"
            content={description}
          />
        )}
      </div>
      {!!price && (
        <div className="text-sm font-semibold text-black">
          <Price price={price} />
        </div>
      )}
    </div>
  );
};

export default ProductDisplay;
