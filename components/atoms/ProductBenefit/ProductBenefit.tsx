import React from 'react';
import Image from 'components/atoms/SafeImage';
import { Icon } from '@iconify/react';
import type { Maybe } from 'lib/graphql/generated/sdk';

export interface ProductBenefitProps {
  id?: string;
  icon?: string;
  label?: string;
  customIcon?: {
    url?: Maybe<string>;
    width?: Maybe<number>;
    height?: Maybe<number>;
  };
}

const ProductBenefit: React.FC<ProductBenefitProps> = ({
  icon,
  label,
  customIcon,
}) => (
  <div className="flex max-w-[4.5rem] flex-col items-center gap-[10px] text-black">
    {customIcon?.url ? (
      <Image
        src={customIcon.url}
        height={customIcon.height || 16}
        width={customIcon.width || 16}
        alt={label ?? ''}
      />
    ) : (
      icon && <Icon icon={icon} height={16} />
    )}
    <span className="text-center text-2xs uppercase text-black">{label}</span>
  </div>
);

export default ProductBenefit;
