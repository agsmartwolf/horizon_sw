import React from 'react';
import RichText from 'components/atoms/RichText';
import type { RootElement } from 'components/atoms/RichText';
import useClassNames from 'hooks/useClassNames';

export interface TextHeadingProps {
  content: string;
  size?: 1 | 2 | 3;
  rootEl?: RootElement;
  className?: string;
  customSize?: boolean;
}

const SIZE_CLASS_MAPPINGS = {
  1: 'text-5xl lg:text-7xl',
  2: 'text-5xl',
  3: 'text-2xl',
};

const TextHeading: React.FC<TextHeadingProps> = ({
  content,
  size = 1,
  rootEl,
  className = '',
  customSize = false,
}) => {
  const classNames = !customSize ? SIZE_CLASS_MAPPINGS[size] : '';
  const cn = useClassNames(classNames, className);
  return <RichText content={content} className={cn} rootEl={rootEl} />;
};

export default TextHeading;
