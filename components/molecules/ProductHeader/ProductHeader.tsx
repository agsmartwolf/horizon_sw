import RichText from 'components/atoms/RichText';
import Tag from 'components/atoms/Tag';
import type { ReactNode } from 'react';

export interface ProductHeaderProps {
  title: string;
  subtitle: string;
  description: string;
  tag?: ReactNode;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({
  title,
  subtitle,
  description,
  tag,
}) => (
  <div>
    <h5 className="capitalize text-sm font-body text-gray-400">{subtitle}</h5>
    <h3 className="mt-2 font-headings text-5xl font-semibold text-black">
      {title}
    </h3>
    {tag && <Tag className="my-4">{tag}</Tag>}
    <div className={`text-sm text-body ${tag ? 'lg:mt-2' : 'mt-2 lg:mt-3'}`}>
      <RichText content={description} />
    </div>
  </div>
);

export default ProductHeader;
