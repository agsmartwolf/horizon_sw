import HorizontalScroller from 'components/atoms/HorizontalScroller';
import ProductPreviewCard from 'components/atoms/ProductPreviewCard';
import React from 'react';
import type { PurchasableProductData } from 'types/shared/products';
import { useViewport } from '../../../hooks/useViewport';

export interface UpSellProps extends React.HTMLAttributes<HTMLDivElement> {
  items: PurchasableProductData[];
}

const UpSell: React.FC<UpSellProps> = ({ items, className }) => {
  const { isMobile } = useViewport();
  return (
    <HorizontalScroller
      className={`flex gap-6 px-6 py-[35px] py-10 lg:pl-14 ${className ?? ''}`}>
      {items.map(item => (
        <ProductPreviewCard
          key={item.id}
          className="w-1/2 min-w-[54vw] shrink-0 snap-start lg:w-[322px]"
          show_product_description={!isMobile}
          product={{
            ...item,
            image: { ...item.image, fill: undefined },
          }}
        />
      ))}
    </HorizontalScroller>
  );
};

export default UpSell;
