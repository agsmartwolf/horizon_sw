import RichText from 'components/atoms/RichText';
import Tag from 'components/atoms/Tag';
import React, { ReactNode, useState } from 'react';
import cn from 'classnames';
import styles from './ProductHeader.module.css';
import { InlineIcon } from '@iconify/react';

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
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <h5 className="capitalize text-sm font-body text-gray-400">{subtitle}</h5>
      <h3 className="mt-2 font-headings text-5xl font-semibold text-black">
        {title}
      </h3>
      {tag && <Tag className="my-4">{tag}</Tag>}
      <div className={`text-sm text-body ${tag ? 'lg:mt-2' : 'mt-2 lg:mt-3'}`}>
        <RichText
          onClick={() => setOpen(!open)}
          content={description}
          className={cn(
            styles.content,
            'text-ellipsis overflow-hidden',
            'transition-[max-height] duration-400 cursor-pointer',
            {
              'max-h-[100px] line-clamp-4 text-justify': !open,
              'max-h-[5000px]': open,
            },
          )}
        />
        <InlineIcon
          height={24}
          width={24}
          icon={`system-uicons:pull-${open ? 'up' : 'down'}`}
          className={cn('text-black cursor-pointer mx-auto', {
            'animate-bounce mt-4': !open,
          })}
          onClick={() => setOpen(!open)}
        />
      </div>
    </div>
  );
};

export default ProductHeader;
