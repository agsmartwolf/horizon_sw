import React, { Children, forwardRef } from 'react';
import {
  Swiper as Carousel,
  SwiperSlide,
  SwiperProps as CarouselProps,
  SwiperRef,
} from 'swiper/react';
import { EffectFade } from 'swiper';

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
}

const Swiper = forwardRef<SwiperRef, SwiperProps>((props: SwiperProps, ref) => {
  const { verticalPadding, effectsEnabled = false } = props;
  const cns = cn(
    'w-full select-none',
    styles.Swiper,
    { [styles.effectsEnabled]: effectsEnabled },
    // SECTION_PADDING_MAP[horizontalPadding ?? SPACING.NONE],
    SECTION_VERTICAL_PADDING_MAP[verticalPadding ?? SPACING.SMALL],
  );
  return (
    <div className={cns} data-testid="Swiper">
      <Carousel {...props} ref={ref} modules={[EffectFade]}>
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
