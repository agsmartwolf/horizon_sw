export enum ImageLayoutType {
  FIXED = 'fixed',
  FILL = 'fill',
  INTRINSIC = 'intrinsic',
  RESPONSIVE = 'responsive',
}

export const layoutFillConfig = {
  layout: ImageLayoutType.FILL,
  width: undefined,
  height: undefined,
};

export const layoutResponsiveConfig = {
  layout: ImageLayoutType.RESPONSIVE,
};
