import Image from 'components/atoms/SafeImage';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { MandatoryImageProps } from 'types/global';
import Swiper from '../Swiper';
import type { SwiperRef } from 'swiper/react';
import ArrowRight from '../../../assets/icons/arrow-right.svg';
import ArrowLeft from '../../../assets/icons/arrow-left.svg';
import cn from 'classnames';

export interface ImageThumbnailsProps
  extends Omit<React.HTMLAttributes<HTMLUListElement>, 'onChange'> {
  images: MandatoryImageProps[];
  imageSize: number;
  defaultValue?: number;
  value?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
}

const ImageThumbnails = React.forwardRef<
  HTMLUListElement,
  ImageThumbnailsProps
>(
  (
    {
      images,
      value: controlledValue,
      onChange,
      defaultValue = 0,
      disabled,
      imageSize,
      ...props
    },
    ref,
  ) => {
    const [current, setCurrent] = useState(defaultValue);

    const value = controlledValue ?? current;
    const swiperRef = useRef<SwiperRef | null>(null);

    const handlePrev = useCallback(() => {
      if (!swiperRef.current) return;
      swiperRef.current.swiper.slidePrev();
    }, []);

    const handleNext = useCallback(() => {
      if (!swiperRef.current) return;
      swiperRef.current.swiper.slideNext();
    }, []);

    const [slidesPerView, setSlidesPerView] = useState(1);

    const handleResize = () => {
      if (!swiperRef.current?.swiper.width) return;
      setSlidesPerView(swiperRef.current?.swiper.width / imageSize);
    };

    useEffect(() => {
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [swiperRef.current?.swiper?.width, imageSize]);

    return (
      <div className="relative select-none">
        <ArrowLeft
          className={cn({
            'hidden absolute -left-7 w-4 top-[calc(50%-16px)] cursor-pointer':
              true,
            'lg:block': slidesPerView < images.length,
          })}
          onClick={handlePrev}
        />
        <ul
          ref={ref}
          {...props}
          className={['pl-1', props.className].join(' ')}>
          <Swiper
            ref={swiperRef}
            effectsEnabled={false}
            slidesPerView={slidesPerView}
            centeredSlides={false}
            spaceBetween={10}
            grabCursor
            initialSlide={0}
            navigation>
            {images.map((image, i) => (
              <li key={image.src.toString()} className={'flex-none w-24 h-24'}>
                <button
                  disabled={disabled}
                  onClick={() => {
                    onChange?.(i);
                    setCurrent(i);
                  }}
                  className={`w-full h-full bg-white relative border border-background-primary transition-opacity hover:opacity-100 disabled:hover:opacity-50 ${
                    value === i
                      ? 'opacity-100 disabled:hover:opacity-100'
                      : 'opacity-50'
                  }`}>
                  {value === i && <div className="sr-only">(Current item)</div>}
                  <div className="flex w-full h-full items-center justify-center overflow-hidden">
                    <Image
                      sizes={`(max-width: ${imageSize}px) 100vw, ${imageSize}px`}
                      src={image.src}
                      alt={image.alt}
                      className={[image.className].join(' ')}
                      style={{
                        objectFit: 'contain',
                        height: 'auto',
                        width: '100%',
                      }}
                    />
                  </div>
                </button>
              </li>
            ))}
          </Swiper>
        </ul>
        <ArrowRight
          className={cn({
            'hidden absolute -right-7 w-4 top-[calc(50%-16px)] cursor-pointer':
              true,
            'lg:block': slidesPerView < images.length,
          })}
          onClick={handleNext}
        />
      </div>
    );
  },
);

ImageThumbnails.displayName = 'ImageThumbnails';

export default ImageThumbnails;
