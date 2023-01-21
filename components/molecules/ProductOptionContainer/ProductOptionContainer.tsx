import InfoTooltip from 'components/atoms/InfoTooltip';
import React from 'react';

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
        <h3 className="font-headings text-sm font-semibold uppercase">
          {name}
        </h3>
        {description && <InfoTooltip text={description} />}
      </div>
      {!!children && (
        <div className="mt-2 flex items-center justify-start gap-2 overflow-x-auto scrollbar-hidden">
          {children}
        </div>
      )}
    </div>
  );
};

export default ProductOptionContainer;
