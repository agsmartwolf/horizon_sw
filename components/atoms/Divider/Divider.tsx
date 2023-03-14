import React from 'react';
import cn from 'classnames';
export enum DIVIDER_HEIGHT {
  EXTRA_SMALL = 'extra_small',
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  EXTRA_LARGE = 'extra_large',
  NONE = 'none',
}

export const DIVIDER_HEIGHT_PADDING_MAP = {
  [DIVIDER_HEIGHT.EXTRA_SMALL]: 'py-5 lg:py-5',
  [DIVIDER_HEIGHT.SMALL]: 'py-10 lg:py-10',
  [DIVIDER_HEIGHT.MEDIUM]: 'py-20 lg:py-20',
  [DIVIDER_HEIGHT.LARGE]: 'py-30 lg:py-30',
  [DIVIDER_HEIGHT.EXTRA_LARGE]: 'py-40 lg:py-40',
  [DIVIDER_HEIGHT.NONE]: 'py-0',
};

export interface DividerProps {
  vertical_spacing?: DIVIDER_HEIGHT;
  background_color?: string;
  className?: string;
  disableDefaultPadding?: boolean;
}

const Divider: React.FC<DividerProps> = ({
  vertical_spacing = DIVIDER_HEIGHT.SMALL,
  background_color,
  className = '',
  disableDefaultPadding = false,
}) => {
  const cln = cn('border-transparent', className, {
    [DIVIDER_HEIGHT_PADDING_MAP[vertical_spacing]]: !disableDefaultPadding,
  });
  return <hr style={{ backgroundColor: background_color }} className={cln} />;
};

export default Divider;
