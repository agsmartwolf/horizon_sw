import React from 'react';

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  rounded?: boolean;
};

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ rounded = false, ...props }, ref) => {
    return (
      <div
        {...props}
        ref={ref}
        className={[
          props.className,
          'animate-pulse bg-gray-100',
          rounded ? 'rounded-xl' : '',
        ].join(' ')}
      />
    );
  },
);

Skeleton.displayName = 'Skeleton';

export default Skeleton;
