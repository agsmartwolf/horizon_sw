import RichText from 'components/atoms/RichText';
import Tag from 'components/atoms/Tag';
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import styles from './ProductHeader.module.css';
import Breadcrumb from '../../atoms/Breadcrumb';
import { InlineIcon } from '@iconify/react';
import { formatRowHtmlFontStyles } from '../../../lib/utils/format';

export interface ProductHeaderProps {
  title: string;
  subtitle: string;
  description: string;
  tags?: Array<string | null>;
}

const MIN_DESCRIPTION_HEIGHT = 130;

const ProductHeader: React.FC<ProductHeaderProps> = ({
  title,
  description,
  tags,
}) => {
  const [open, setOpen] = useState(false);
  const [stateChangedOnce, setStateChangedOnce] = useState(false);

  const descriptionBlockRef = useRef<HTMLDivElement>(null);
  const [descriptionHeight, setDescriptionHeight] = useState(0);

  useEffect(() => {
    if (descriptionBlockRef.current) {
      setDescriptionHeight(descriptionBlockRef.current.clientHeight);
    }
  }, []);

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
      <div
        className={`text-sm text-body ${tags ? 'lg:mt-2' : 'mt-2 lg:mt-3'}`}
        ref={descriptionBlockRef}>
        <RichText
          onClick={() => {
            setOpen(!open);
            setStateChangedOnce(true);
          }}
          content={formatRowHtmlFontStyles(description) ?? ''}
          className={cn(
            styles.content,
            'text-ellipsis overflow-hidden text-justify',
            'transition-[max-height] duration-400 cursor-pointer select-none',
            {
              'max-h-[5000px]': open,
              [`line-clamp-6 max-h-[${MIN_DESCRIPTION_HEIGHT}px]`]:
                !open && descriptionHeight !== 0,
            },
          )}
        />
        <InlineIcon
          height={24}
          width={24}
          icon={`system-uicons:pull-${open ? 'up' : 'down'}`}
          className={cn('text-black cursor-pointer mx-auto', {
            'mt-4': !open,
            'animate-bounce': !open && !stateChangedOnce,
            hidden: descriptionHeight < MIN_DESCRIPTION_HEIGHT,
          })}
          onClick={() => setOpen(!open)}
        />
      </div>
    </div>
  );
};

export default ProductHeader;
