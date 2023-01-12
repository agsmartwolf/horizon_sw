import React from 'react';
import * as Slider from '@radix-ui/react-slider';
import useClassNames from '../../../hooks/useClassNames';

export interface RangeProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  label?: string;
  thumbClassName?: string;
}

const Range: React.FC<RangeProps> = ({
  min = 0,
  max = 100,
  value,
  onChange,
  label,
  thumbClassName = '',
}) => {
  const limitedMin = Math.max(min, value[0]);
  const limitedMax = Math.min(max, value[1]);

  const cnThumb = useClassNames(
    'block h-[9px] w-[9px] rounded-full',
    thumbClassName,
  );

  return (
    <form>
      <Slider.Root
        minStepsBetweenThumbs={1}
        step={1}
        value={[limitedMin, limitedMax]}
        max={max}
        min={min}
        aria-label={label}
        onValueChange={onChange}
        className="relative flex h-5 w-full cursor-pointer touch-none select-none items-center">
        <Slider.Track className="flex h-[1px] grow items-center rounded-full bg-input-standard">
          <Slider.Range className="absolute h-[1px] rounded-full bg-black" />
        </Slider.Track>
        <Slider.Thumb className={cnThumb} />
        <Slider.Thumb className={cnThumb} />
      </Slider.Root>
    </form>
  );
};

export default Range;
