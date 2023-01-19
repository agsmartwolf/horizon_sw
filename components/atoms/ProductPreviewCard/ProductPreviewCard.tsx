import React, { useMemo } from 'react';
import type { PurchasableProductData } from 'types/shared/products';
import ProductPreviewCardPurchasable from './ProductPreviewCardPurchasable';
import ProductPreviewCardSimple from './ProductPreviewCardSimple';
import ProductPreviewCardSkeleton from './ProductPreviewCardSkeleton';
import cn from 'classnames';

import styles from './ProductPreview.module.css';

export interface ProductPreviewCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  product?: PurchasableProductData;
  loading?: boolean;
  show_product_price?: boolean;
  show_product_description?: boolean;
}

const ProductPreviewCard: React.FC<ProductPreviewCardProps> = ({
  product,
  loading = false,
  show_product_price = true,
  show_product_description = true,
  ...props
}) => {
  const fromPriceLabel = useMemo(() => {
    const hasStandardPrice = !!product?.purchaseOptions?.standard?.price;
    // TODO: i18n
    return !hasStandardPrice ? 'From ' : '';
  }, [product?.purchaseOptions?.standard?.price]);

  const className = cn(
    props.className,
    styles.productWrapper,
    'transition-all ease-in-out hover:scale-110 hover:drop-shadow-lg duration-150',
  );

  if (loading) return <ProductPreviewCardSkeleton />;

  if (product) {
    return product.hasQuickAdd ? (
      <ProductPreviewCardPurchasable
        {...props}
        className={className}
        show_product_price={show_product_price}
        show_product_description={show_product_description}
        product={product}
        fromPriceLabel={fromPriceLabel}
      />
    ) : (
      <ProductPreviewCardSimple
        {...props}
        className={className}
        show_product_price={show_product_price}
        show_product_description={show_product_description}
        product={product}
        fromPriceLabel={fromPriceLabel}
      />
    );
  }

  return null;
};

export default ProductPreviewCard;
