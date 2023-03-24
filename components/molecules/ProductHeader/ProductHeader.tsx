import RichText from 'components/atoms/RichText';
import Tag from 'components/atoms/Tag';
import React from 'react';
import cn from 'classnames';
import styles from './ProductHeader.module.css';
import Breadcrumb from '../../atoms/Breadcrumb';
import { formatRowHtmlFontStyles } from '../../../lib/utils/format';

export interface ProductHeaderProps {
  title: string;
  subtitle: string;
  description: string;
  descriptionShort: string;
  tags?: Array<string | null>;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({
  title,
  descriptionShort,
  tags,
  subtitle,
}) => {
  return (
    <div>
      {/*<h5 className="capitalize text-sm font-body text-gray-400">{subtitle}</h5>*/}
      <Breadcrumb
        customText={title}
        extraRoute={{
          route: {
            title: subtitle,
            href: `/categories/${subtitle.trim().toLowerCase()}`,
          },
          position: -1,
        }}
      />
      <h3 className="mt-2 font-headings text-5xl font-semibold text-black">
        {title}
      </h3>
      {tags && (
        <div className="my-4">
          {tags.map((tag, index) => (
            <Tag key={index} className="mr-2 mb-2">
              {tag}
            </Tag>
          ))}
        </div>
      )}
      <div
        className={`text-sm text-body ${
          tags ? 'lg:mt-2' : 'mt-2 lg:mt-3'
        } text-justify`}>
        <RichText
          content={formatRowHtmlFontStyles(descriptionShort) ?? ''}
          className={cn(styles.content)}
        />
      </div>
    </div>
  );
};

export default ProductHeader;
