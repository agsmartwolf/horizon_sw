import type { ImageProps } from 'next/image';

export interface MandatoryImageProps extends ImageProps {
  alt: string;
  width: number;
  height: number;
}

export interface ILink {
  label: string;
  link: string;
}
