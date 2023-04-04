import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import RichText from '../RichText';
import { formatRowHtmlFontStyles } from '../../../lib/utils/format';
import styles from '../../molecules/ProductHeader/ProductHeader.module.css';
import { InlineIcon } from '@iconify/react';

export interface CollapsableTextProps {
  text: string;
  linesDisplayed?: number;
}
const MIN_DESCRIPTION_HEIGHT = 180;

const CollapsableText: React.FC<CollapsableTextProps> = ({
  text,
  linesDisplayed = 6,
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
    <div className={`text-sm text-body`} ref={descriptionBlockRef}>
      <RichText
        onClick={() => {
          setOpen(!open);
          setStateChangedOnce(true);
        }}
        content={formatRowHtmlFontStyles(text) ?? ''}
        className={cn(
          styles.content,
          'text-ellipsis overflow-hidden text-justify',
          'transition-[max-height] duration-400 cursor-pointer select-none',
          {
            'max-h-[5000px]': open,
            [`line-clamp-${linesDisplayed}`]: !open && descriptionHeight !== 0,
            [`max-h-[130px]`]: !open && descriptionHeight !== 0,
          },
        )}
      />
      <InlineIcon
        height={24}
        width={24}
        icon={`system-uicons:pull-${open ? 'up' : 'down'}`}
        className={cn('text-black cursor-pointer mx-auto', {
          'mt-4': true,
          'animate-bounce': !open && !stateChangedOnce,
          hidden: descriptionHeight < MIN_DESCRIPTION_HEIGHT,
        })}
        onClick={() => setOpen(!open)}
      />
    </div>
  );
};

export default CollapsableText;
