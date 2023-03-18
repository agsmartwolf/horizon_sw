import type { ImageProps } from 'next/image';
import type { ORDER_STATUS } from './orders';
import type { STOCK_STATUS } from './shared/products';
import type { SUBSCRIPTION_STATUS } from './subscription';

export interface MandatoryImageProps extends ImageProps {
  alt: string;
  width: number;
  height: number;
  id?: string;
  // id of color product option - used for mapping image and color option for auto-select feature
  colorId?: string;
}

export interface ILink {
  label: string;
  link: string;
}

export type Status = SUBSCRIPTION_STATUS | ORDER_STATUS | STOCK_STATUS;

// extend window with gtag
declare global {
  interface Window {
    gtag: any;
  }
}
