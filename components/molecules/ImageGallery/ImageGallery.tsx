import ImageThumbnails from 'components/atoms/ImageThumbnails';

import Image from 'components/atoms/SafeImage';
import React, { useState, useCallback } from 'react';
import { useSwipeable } from 'react-swipeable';
import type { MandatoryImageProps } from 'types/global';
import SlideNav from '../../atoms/SlideNav';
import ArrowRight from 'assets/icons/arrow-right.svg';
import ArrowLeft from 'assets/icons/arrow-left.svg';

export interface ImageGalleryProps {
  images: MandatoryImageProps[];
  aspectRatio?: `${number}/${number}`;
}

const getImageClassName = (
  index: number,
  currentSlide: number,
  length: number,
) => {
  const prevIndex = currentSlide - 1 >= 0 ? currentSlide - 1 : length - 1;
  const nextIndex = currentSlide + 1 <= length - 1 ? currentSlide + 1 : 0;

  if (index === currentSlide) return 'left-0 lg:left-0 lg:opacity-100 z-10';
  else if (index === prevIndex) return '-left-full lg:left-0 lg:opacity-0';
  else if (index === nextIndex) return 'left-full lg:left-0 lg:opacity-0';

  return 'hidden lg:flex lg:left-0 lg:opacity-0';
};

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, aspectRatio }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const setPrevSlide = useCallback(
    () =>
      setCurrentSlide(prev => (prev - 1 >= 0 ? prev - 1 : images.length - 1)),
    [images.length],
  );

  const setNextSlide = useCallback(
    () =>
      setCurrentSlide(prev => (prev + 1 <= images.length - 1 ? prev + 1 : 0)),
    [images.length],
  );

  const handlers = useSwipeable({
    onSwipedLeft: setNextSlide,
    onSwipedRight: setPrevSlide,
    preventDefaultTouchmoveEvent: true,
  });

  return (
    <div className="w-full select-text flex flex-col-reverse gap-2">
      <ImageThumbnails
        className="hidden lg:flex overflow-y-auto w-full"
        images={images}
        imageSize={100}
        value={currentSlide}
        onChange={value => setCurrentSlide(value)}
      />
      <div className="relative w-full">
        <ArrowLeft
          width={16}
          height={20}
          className="text-black absolute top-1/2 left-0 z-20 md:hidden"
          onClick={setPrevSlide}
        />
        <div
          {...handlers}
          className="align-center relative flex w-full justify-center overflow-hidden lg:w-auto"
          style={{
            aspectRatio,
          }}>
          {images.map((image, i) => (
            <div
              key={image.src.toString()}
              aria-hidden={i !== currentSlide ? 'true' : undefined}
              tabIndex={-1}
              className={`absolute flex h-full w-full items-center justify-center transition-all lg:transition-opacity ${getImageClassName(
                i,
                currentSlide,
                images.length,
              )}`}>
              <div className="px-4 lg:px-0">
                <Image
                  sizes="(max-width: 640px) 100vw, 540px"
                  width={image.width}
                  height={image.height}
                  src={image.src}
                  alt={image.alt}
                  className={[image.className].join(' ')}
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </div>
          ))}
        </div>
        <ArrowRight
          width={16}
          height={20}
          className="text-black absolute right-0 top-1/2 z-20 md:hidden"
          onClick={setNextSlide}
        />

        <SlideNav
          className="absolute left-1/2 bottom-6 z-20 -translate-x-1/2 -translate-y-full lg:hidden"
          quantity={images.length}
          value={currentSlide}
          disabled
        />

        <div className="sr-only">
          Image {currentSlide + 1} of {images.length}
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;
