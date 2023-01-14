import cn from 'classnames';
import React from 'react';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  secondary?: boolean;
  paddingYClasses?: string;
}

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ paddingYClasses = '', secondary, ...props }, ref) => {
    const classes = cn(
      'inline-block rounded-md px-4 text-xs font-semibold uppercase ',
      'lg:text-3xs',
      {
        'py-2 lg:py-1.5': !paddingYClasses,
        'bg-accent text-black': !secondary,
        'bg-input-standard text-background-white': !!secondary,
      },
      paddingYClasses,
      props.className,
    );

    return (
      <span {...props} className={classes} ref={ref}>
        {props.children}
      </span>
    );
  },
);

Tag.displayName = 'Tag';

export default Tag;
