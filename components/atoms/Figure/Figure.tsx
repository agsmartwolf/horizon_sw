import { SECTION_MARGIN_MAP, SPACING } from 'lib/globals/sizings';
import Image from 'components/atoms/SafeImage';
import React, { forwardRef } from 'react';
import type { MandatoryImageProps } from 'types/global';
import type {
  ContentBlockComponentWithRef,
  PageSectionSpacing,
} from 'types/shared/sections';
import cn from 'classnames';

export interface FigureProps
  extends React.HTMLAttributes<HTMLElement>,
    Partial<PageSectionSpacing> {
  caption: string;
  image: MandatoryImageProps;
  rounded?: boolean;
  innerCaption?: boolean;
  captionClassName?: string;
}

const Figure: ContentBlockComponentWithRef<FigureProps> = forwardRef<
  HTMLElement,
  FigureProps
>(
  (
    {
      caption,
      image,
      rounded,
      horizontal_spacing: horizontalSpacing = SPACING.NONE,
      captionClassName = '',
      innerCaption = false,
      ...props
    },
    ref,
  ) => (
    <figure
      {...props}
      ref={ref}
      className={[
        'flex flex-col gap-4',
        SECTION_MARGIN_MAP[horizontalSpacing],
        props.className,
      ].join(' ')}>
      <Image
        {...image}
        className={rounded ? 'rounded-2xl' : ''}
        alt={image.alt}
      />
      {innerCaption ? (
        <figcaption
          className={cn('text-left text-sm lg:text-xl', captionClassName)}
          dangerouslySetInnerHTML={{
            __html: innerCaption ? caption : '',
          }}
        />
      ) : (
        <figcaption
          className={cn('text-left text-lg lg:text-xl', captionClassName)}>
          {caption}
        </figcaption>
      )}
    </figure>
  ),
);

Figure.displayName = 'Figure';

Figure.propMaps = {
  image: 'mapImage',
};

export default Figure;
