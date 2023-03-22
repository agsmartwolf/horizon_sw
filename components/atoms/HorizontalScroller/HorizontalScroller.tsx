import cn from 'classnames';
import useDraggableScroll from 'hooks/useDraggableScroll';
import React, { useRef, useEffect, useCallback, useState } from 'react';
import { InlineIcon } from '@iconify/react';

export interface HorizontalScrollerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * If true, the right padding will be applied to the end of the scrollable area.
   * This is necessary because browsers will ignore the right padding when
   * calculating the scrollWidth of the element.
   *
   * `Default: true`
   */
  applyRightPaddingOnScroll?: boolean;
  scrollbarHidden?: boolean;
  showArrow?: boolean;
  arrowWidth?: number;
  arrowClassname?: string;
}

function sideScroll(
  element: HTMLElement,
  direction: 'left' | 'right' = 'right',
  speed = 25,
  distance = 100,
  step = 10,
) {
  let scrollAmount = 0;
  const slideTimer = setInterval(function () {
    if (direction === 'left') {
      element.scrollLeft -= step;
    } else {
      element.scrollLeft += step;
    }
    scrollAmount += step;
    if (scrollAmount >= distance) {
      window.clearInterval(slideTimer);
    }
  }, speed);
}

const HorizontalScroller: React.FC<HorizontalScrollerProps> = ({
  children,
  applyRightPaddingOnScroll = true,
  scrollbarHidden = true,
  showArrow = false,
  arrowWidth = 40,
  arrowClassname = '',
  ...props
}) => {
  const handlers = useDraggableScroll();
  const ref = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);

  const setVariables = useCallback((element: HTMLDivElement) => {
    // element.style.removeProperty('padding-right');
    element.style.removeProperty('--scroll-width');

    requestAnimationFrame(() => {
      const rightPadding = parseFloat(
        window.getComputedStyle(element).paddingRight,
      );

      // element.style.paddingRight = '0';
      element.style.setProperty('--after-width', `${rightPadding}px`);
      element.style.setProperty('--scroll-width', `${element.scrollWidth}px`);
    });
  }, []);

  useEffect(() => {
    if (!applyRightPaddingOnScroll) return;

    const element = ref.current;
    if (!element) return;

    setVariables(element);

    const handler = () => {
      setVariables(element);
    };

    window.addEventListener('resize', handler);

    return () => window.removeEventListener('resize', handler);
  }, [setVariables, applyRightPaddingOnScroll, children]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handler = () => {
      setCanScroll(element.scrollWidth > element.clientWidth);
    };
    handler();
    window.addEventListener('resize', handler);

    return () => window.removeEventListener('resize', handler);
  }, [children]);

  return (
    <div
      className={cn(
        'relative snap-mandatory overflow-hidden scroll-px-6 touch:snap-x flex items-center',
        {
          [`pr-[${arrowWidth}px]`]: showArrow,
        },
      )}>
      <div
        ref={ref}
        {...props}
        className={cn(
          'relative snap-mandatory scroll-px-6 overflow-x-auto touch:snap-x flex items-center',
          props.className ?? '',
          {
            'scrollbar-hidden': !!scrollbarHidden,
            'after:absolute after:left-[var(--scroll-width)] after:block after:h-1 after:w-[var(--after-width)]':
              applyRightPaddingOnScroll,
          },
        )}
        {...handlers}>
        {children}
      </div>
      {canScroll && showArrow && (
        <>
          <div
            className={cn('absolute top-0 bottom-0 h-full', {
              [`left-0`]: showArrow,
              [arrowClassname]: !!arrowClassname,
            })}>
            <InlineIcon
              icon="mdi:chevron-left"
              className="text-black-100 max-h-[100%] cursor-pointer"
              width={arrowWidth}
              onClick={() => {
                const element = ref.current;
                if (!element) return;

                sideScroll(element, 'left');
              }}
            />
          </div>
          <div
            className={cn('absolute top-0 bottom-0 h-full', {
              [`right-0`]: showArrow,
              [arrowClassname]: !!arrowClassname,
            })}>
            <InlineIcon
              icon="mdi:chevron-right"
              className="text-black-100 max-h-[100%] cursor-pointer"
              width={arrowWidth}
              onClick={() => {
                const element = ref.current;
                if (!element) return;

                sideScroll(element, 'right');
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default HorizontalScroller;
