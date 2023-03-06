import ImageThumbnails from 'components/atoms/ImageThumbnails';

import Image from 'components/atoms/SafeImage';
import React, { useState, useCallback, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import type { MandatoryImageProps } from 'types/global';
import SlideNav from '../../atoms/SlideNav';
import ArrowRight from 'assets/icons/arrow-right.svg';
import ArrowLeft from 'assets/icons/arrow-left.svg';

export interface ImageGalleryProps {
  images: MandatoryImageProps[];
  aspectRatio?: `${number}/${number}`;
  handleChangeCurrentImage: (n: MandatoryImageProps) => void;
  selectedColorId?: string;
  // selectedProductOptions: Map<string, string>;
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

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  aspectRatio,
  handleChangeCurrentImage,
  selectedColorId,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const setPrevSlide = useCallback(() => {
    setCurrentSlide(prev => (prev - 1 >= 0 ? prev - 1 : images.length - 1));
    internalSlideChange.current = true;
  }, [images.length]);

  const setNextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1 <= images.length - 1 ? prev + 1 : 0));
    internalSlideChange.current = true;
  }, [images.length]);

  const handlers = useSwipeable({
    onSwipedLeft: setNextSlide,
    onSwipedRight: setPrevSlide,
    preventDefaultTouchmoveEvent: true,
  });

  const internalSlideChange = React.useRef(false);

  // TODO fix infinite loop
  useEffect(() => {
    if (internalSlideChange.current) {
      handleChangeCurrentImage(images[currentSlide]);
      internalSlideChange.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlide]);

  useEffect(() => {
    if (internalSlideChange.current) return;
    // const selectedColorId = selectedProductOptions.get('color');
    if (!selectedColorId) return;
    if (selectedColorId === images[currentSlide].colorId) return;
    const index = images.findIndex(image => image.colorId === selectedColorId);
    if (index === -1 || index === currentSlide) return;
    setCurrentSlide(index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedColorId, currentSlide]);

  return (
    <div className="w-full select-text flex flex-col-reverse gap-2">
      <ImageThumbnails
        className="hidden lg:flex overflow-y-hidden w-full"
        images={images}
        imageSize={100}
        value={currentSlide}
        onChange={value => {
          setCurrentSlide(value);
          internalSlideChange.current = true;
        }}
      />
      <div className="relative w-full">
        <ArrowLeft
          width={16}
          height={20}
          className="text-black absolute top-1/2 left-0 z-20 md:hidden"
          onClick={setPrevSlide}
        />
        <div
          className="align-center relative flex justify-center w-full overflow-hidden lg:w-auto"
          {...handlers}>
          {images.map((image, i) => (
            <div
              className="w-full grow shrink-0"
              key={image.src.toString()}
              style={{
                aspectRatio: `${image.width}/${image.height}` || aspectRatio,
              }}>
              <div
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
