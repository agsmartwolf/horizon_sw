import RichText from 'components/atoms/RichText';
import Tag from 'components/atoms/Tag';
import React, { useState } from 'react';
import cn from 'classnames';
import styles from './ProductHeader.module.css';
import Breadcrumb from '../../atoms/Breadcrumb';
// import { InlineIcon } from '@iconify/react';

export interface ProductHeaderProps {
  title: string;
  subtitle: string;
  description: string;
  tags?: Array<string | null>;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({
  title,
  description,
  tags,
}) => {
  const [open, setOpen] = useState(true);
  return (
    <div>
      {/*<h5 className="capitalize text-sm font-body text-gray-400">{subtitle}</h5>*/}
      <Breadcrumb />
      <h3 className="mt-2 font-headings text-5xl font-semibold text-black">
        {title}
      </h3>
      {tags && (
        <div className="my-4">
          {tags.map((tag, index) => (
            <Tag key={index} className="mr-2">
              {tag}
            </Tag>
          ))}
        </div>
      )}
      <div className={`text-sm text-body ${tags ? 'lg:mt-2' : 'mt-2 lg:mt-3'}`}>
        <RichText
          onClick={() => setOpen(!open)}
          content={description}
          className={cn(
            styles.content,
            'text-ellipsis overflow-hidden',
            'transition-[max-height] duration-400 cursor-pointer',
            {
              'max-h-[100px] text-justify': !open,
              'max-h-[5000px]': open,
            },
          )}
        />
        {/*<InlineIcon*/}
        {/*  height={24}*/}
        {/*  width={24}*/}
        {/*  icon={`system-uicons:pull-${open ? 'up' : 'down'}`}*/}
        {/*  className={cn('text-black cursor-pointer mx-auto', {*/}
        {/*    'animate-bounce mt-4': !open,*/}
        {/*  })}*/}
        {/*  onClick={() => setOpen(!open)}*/}
        {/*/>*/}
      </div>
    </div>
  );
};

export default ProductHeader;
