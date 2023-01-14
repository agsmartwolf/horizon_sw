import React from 'react';
import RichText from 'components/atoms/RichText';
import type { RootElement } from 'components/atoms/RichText';
import useClassNames from 'hooks/useClassNames';

export interface TextBodyProps {
  content: string;
  size?: 1 | 2 | 3 | 4 | 5;
  rootEl?: RootElement;
  className?: string;
}

const SIZE_CLASS_MAPPINGS = {
  1: 'text-md',
  2: 'text-sm',
  3: 'text-xs',
  4: 'text-2xs',
  5: 'text-3xs',
};

const TextBody: React.FC<TextBodyProps> = ({
  content,
  size = 1,
  rootEl,
  className = '',
}) => {
  const classNames = useClassNames(SIZE_CLASS_MAPPINGS[size], className);
  return <RichText content={content} className={classNames} rootEl={rootEl} />;
};

export default TextBody;
