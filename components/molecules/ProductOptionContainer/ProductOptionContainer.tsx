import HorizontalScroller from 'components/atoms/HorizontalScroller';
import InfoTooltip from 'components/atoms/InfoTooltip';
import React from 'react';
import cn from 'classnames';

export interface ProductOptionContainerProps {
  name: string;
  description?: string;
  children: React.ReactNode;
}

const ProductOptionContainer: React.FC<ProductOptionContainerProps> = ({
  name,
  description,
  children,
}) => {
  return (
    <div className="text-black">
      <div className="flex gap-2">
        <h3 className="font-headings text-sm font-semibold uppercase mb-2">
          {name}
        </h3>
        {description && <InfoTooltip text={description} />}
      </div>
      {!!children && (
        <HorizontalScroller
          showArrow
          arrowClassname="bg-white"
          className={cn('py-2.5 pr-2.5')}>
          <div className="flex items-center justify-start gap-4 scrollbar-hidden">
            {children}
          </div>
        </HorizontalScroller>
      )}
    </div>
  );
};

export default ProductOptionContainer;
