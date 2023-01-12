import { SECTION_MARGIN_MAP, SPACING } from 'lib/globals/sizings';
import Image from 'components/atoms/SafeImage';
import React, { forwardRef } from 'react';
import type { MandatoryImageProps } from 'types/global';
import type {
  ContentBlockComponentWithRef,
  PageSectionSpacing,
} from 'types/shared/sections';
import useClassNames from '../../../hooks/useClassNames';

export interface FigureProps
  extends React.HTMLAttributes<HTMLElement>,
    Partial<PageSectionSpacing> {
  caption: string;
  image: MandatoryImageProps;
  rounded?: boolean;
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
      <figcaption
        className={useClassNames(
          'text-left text-lg lg:text-xl',
          captionClassName,
        )}>
        {caption}
      </figcaption>
    </figure>
  ),
);

Figure.displayName = 'Figure';

Figure.propMaps = {
  image: 'mapImage',
};

export default Figure;
