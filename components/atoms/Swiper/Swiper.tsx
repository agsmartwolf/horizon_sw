import React, { Children, forwardRef } from 'react';
import {
  Swiper as Carousel,
  SwiperSlide,
  SwiperProps as CarouselProps,
  SwiperRef,
} from 'swiper/react';
import { EffectFade, Autoplay } from 'swiper';

import 'swiper/css';
import styles from './Swiper.module.css';
import 'swiper/css/effect-fade';

import {
  SECTION_VERTICAL_PADDING_MAP,
  SPACING,
} from '../../../lib/globals/sizings';
import cn from 'classnames';

interface SwiperProps extends CarouselProps {
  children: React.ReactNode[];
  verticalPadding?: SPACING;
  effectsEnabled?: boolean;

  // rendering first slide child while swiper is not loaded
  showPreviewSlide?: boolean;
}

const Swiper = forwardRef<SwiperRef, SwiperProps>((props: SwiperProps, ref) => {
  const {
    verticalPadding,
    effectsEnabled = false,
    className = '',
    showPreviewSlide = false,
  } = props;
  const [isInited, setIsInited] = React.useState(false);
  const cns = cn(
    'w-full select-none',
    styles.Swiper,
    { [styles.effectsEnabled]: effectsEnabled },
    // SECTION_PADDING_MAP[horizontalPadding ?? SPACING.NONE],
    SECTION_VERTICAL_PADDING_MAP[verticalPadding ?? SPACING.SMALL],
    className,
  );

  return (
    <div className={cns} data-testid="Swiper">
      {showPreviewSlide ? (
        <SwiperSlide
          className={cn('pointer-events-none', {
            'opacity-0': isInited,
          })}>
          {props.children[0]}
        </SwiperSlide>
      ) : null}
      <Carousel
        {...props}
        className={cn(props.className, {
          'opacity-0': !isInited,
        })}
        ref={ref}
        modules={[EffectFade, Autoplay]}
        onAfterInit={() => {
          setIsInited(true);
        }}>
        {Children.map(props.children, (child, index) => (
          <SwiperSlide key={(child as any)?.id || (child as any)?.key || index}>
            {child}
          </SwiperSlide>
        ))}
      </Carousel>
    </div>
  );
});

export default Swiper;
