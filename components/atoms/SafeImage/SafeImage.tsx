import Image, { ImageProps } from 'next/image';
import React from 'react';
import { useViewport } from '../../../hooks/useViewport';

export type SafeResponsiveSsrImage = {
  mobile: ImageProps;
  desktop: ImageProps;
  className?: string;
};

export type SafeImageProps = ImageProps | SafeResponsiveSsrImage;

const SafeImage: React.FC<SafeImageProps> = props => {
  const { isMobile } = useViewport();
  return (props as SafeResponsiveSsrImage).mobile &&
    (props as SafeResponsiveSsrImage).desktop ? (
    <>
      {(!isMobile || isMobile === undefined) && (
        <Image
          {...(props as SafeResponsiveSsrImage).desktop}
          className={props.className}
        />
      )}
      {(isMobile || isMobile === undefined) && (
        <Image
          {...(props as SafeResponsiveSsrImage).mobile}
          className={props.className}
        />
      )}
    </>
  ) : (
    <Image
      {...props}
      alt={(props as ImageProps).alt ?? ''}
      src={(props as ImageProps).src || '/images/image_placeholder.svg'}
      width={(props as ImageProps).width ?? 0}
      height={(props as ImageProps).height ?? 0}
    />
  );
};

export default SafeImage;
