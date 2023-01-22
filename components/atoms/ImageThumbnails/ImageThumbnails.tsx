import Image from 'components/atoms/SafeImage';
import React, { useState } from 'react';
import type { MandatoryImageProps } from 'types/global';

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

    return (
      <ul
        ref={ref}
        {...props}
        className={[
          'flex items-center gap-1 overflow-x-auto w-full scrollbar-hidden',
          props.className,
        ].join(' ')}>
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
      </ul>
    );
  },
);

ImageThumbnails.displayName = 'ImageThumbnails';

export default ImageThumbnails;
