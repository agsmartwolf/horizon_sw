import React, { Children, FC } from 'react';
import { Swiper as Carousel, SwiperSlide, SwiperProps as CarouselProps } from 'swiper/react';

import 'swiper/css';
import styles from './Swiper.module.css';
import useClassNames from "../../../hooks/useClassNames";
import { SECTION_VERTICAL_PADDING_MAP, SPACING } from "../../../lib/globals/sizings";

interface SwiperProps extends CarouselProps {
    children: React.ReactNode[];
    horizontalPadding?: SPACING;
}

const Swiper: FC<SwiperProps> = (props: SwiperProps) => {
    const { horizontalPadding } = props
    const cn = useClassNames(styles.Swiper,
        // SECTION_PADDING_MAP[horizontalPadding ?? SPACING.MEDIUM],
        SECTION_VERTICAL_PADDING_MAP[horizontalPadding ?? SPACING.MEDIUM]
    )
    return (
        <div className={cn} data-testid="Swiper">
            <Carousel
                {...props}
            >
                {Children.map(props.children, (child, index) => (
                    <SwiperSlide key={(child as any)?.id || (child as any)?.key || index}>{child}</SwiperSlide>
                ))}
            </Carousel>
        </div>
    );
}

export default Swiper;
