import cn from 'classnames';
import React from 'react';
import styles from './styles.module.scss';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  tag: GenericTagType;
  secondary?: boolean;
  customPositioning?: boolean;
  paddingYClasses?: string;
}

export enum GenericTagType {
  ComingSoon = 'coming_soon',
  Premium = 'premium',
}
export const getTagTypeByName = (tagName: string) => {
  switch (tagName.toLowerCase()) {
    // the same case for two different values
    case 'coming soon':
    case 'скоро в продаже':
      return GenericTagType.ComingSoon;
    case 'premium':
    case 'премиум':
      return GenericTagType.Premium;
    default:
      return null;
  }
};

const GenericTag = React.forwardRef<HTMLSpanElement, TagProps>(
  (
    {
      paddingYClasses = '',
      secondary,
      tag,
      customPositioning = false,
      ...props
    },
    ref,
  ) => {
    const commonClass = cn(
      'font-tag uppercase absolute',
      'font-semibold inline-block text-xs px-1.5 whitespace-wrap text-center',
      'max-w-[120px]',
      {
        'bottom-[77px] right-[0] sm:right-[10px] sm:top-[10px] sm:bottom-[unset]':
          !customPositioning,
      },
    );
    switch (tag.toLowerCase()) {
      case GenericTagType.ComingSoon: {
        const classes = cn(
          'bg-green-100 text-black h-fit',
          {
            'py-2 lg:py-1.5': !paddingYClasses,
          },
          paddingYClasses,
          props.className,
          commonClass,
        );
        return (
          <span {...props} className={classes} ref={ref}>
            {props.children}
          </span>
        );
      }
      case GenericTagType.Premium: {
        const classes = cn(
          'bg-black text-white h-fit',
          {
            'py-2 lg:py-1.5': !paddingYClasses,
          },
          paddingYClasses,
          props.className,
          commonClass,
          styles.PremiumTag,
        );
        return (
          <span {...props} className={classes} ref={ref}>
            {props.children}
            <div className={styles.PremiumTagAnimation} />
          </span>

          /*<div {...props} className={classes} ref={ref}>
          <div className={'relative'}>
            <span>{props.children}</span>
            <div className={styles.PremiumTagAnimation}/>
          </div>
        </div>*/
        );
      }
      default: {
        return null;
        // const classes = cn(
        //   'inline-block px-4 text-xs font-light uppercase ',
        //   'lg:text-3xs',
        //   {
        //     'py-2 lg:py-1.5': !paddingYClasses,
        //     'bg-gray-100 text-gray-400': !secondary,
        //     'bg-input-standard text-background-white': !!secondary,
        //   },
        //   paddingYClasses,
        //   props.className,
        // );
        // return (
        //   <span {...props} className={classes} ref={ref}>
        //     {props.children}
        //   </span>
        // );
      }
    }
  },
);

GenericTag.displayName = 'GenericTag';

export default GenericTag;
