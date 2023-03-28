import React, { useEffect, useState } from 'react';
import styles from './PawPrintAnimation.module.scss';
import PawPrint from './PawPrint';
import cn from 'classnames';

const PAD_SIZE = 5;
const padWidthRatio = 4;
const POSITION_RANDOMIZE_DELAY = 6000;
const PAW_ANIMATION_DELAY = 0.55;
const PAW_ANIMATION_DURATION = 6;

// color array with 20 different bright colors
const COLORS = [
  'bg-[#FF0000]',
  'bg-[#FF7F00]',
  'bg-[#FFFF00]',
  'bg-[#00FF00]',
  'bg-[#0000FF]',
  'bg-[#4B0082]',
  'bg-[#9400D3]',
  'bg-[#FF0000]',
  'bg-[#FF7F00]',
  'bg-[#FFFF00]',
  'bg-[#00FF00]',
  'bg-[#0000FF]',
  'bg-[#4B0082]',
  'bg-[#9400D3]',
  'bg-[#FF0000]',
  'bg-[#FF7F00]',
  'bg-[#FFFF00]',
  'bg-[#00FF00]',
  'bg-[#0000FF]',
  'bg-[#4B0082]',
  'bg-[#9400D3]',
];

const getTailwindAnimationClassDependOnPawIndex = (
  pawWidth: number,
  index: number,
  amount: number,
) => {
  // get values for animation-duration, left, top css properties depend on index and pawSize
  // and return tailwind class name with this values
  const left = index % 2 === 0 ? 0 : pawWidth * 1.5;
  const top = pawWidth * index + pawWidth * 2;
  // const animationDuration = Math.abs(
  //   index * PAW_ANIMATION_DELAY - PAW_ANIMATION_DURATION,
  // );
  const animationDuration = PAW_ANIMATION_DURATION;
  // random rotation between -10 and 10deg
  const randomRotation = index % 2 === 0 ? -20 : 20;
  const animationDelay =
    PAW_ANIMATION_DELAY * amount - index * PAW_ANIMATION_DELAY;

  // random value between 1 and 2
  const randomIterationCount = Math.floor(Math.random() * 2) + 1;

  return {
    left: `${Math.floor(left)}px`,
    top: `${Math.floor(top)}px`,
    animationDuration: `${animationDuration}s`,
    transform: `rotate(${randomRotation}deg)`,
    animationDelay: `${animationDelay}s`,
    animationIterationCount: randomIterationCount.toString(),
  };
};

const PawPrintAnimation = ({ padSize = PAD_SIZE }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [pawPrints, setPawPrints] = useState<number>(0);
  const [colors, setColors] = useState<string[]>([]);
  const randomizeColors = (n: number) => {
    const randomColors = [];
    for (let i = 0; i < n; i++) {
      const randomIndex = Math.floor(Math.random() * COLORS.length);
      randomColors.push(COLORS[randomIndex]);
      colors.splice(randomIndex, 1);
    }
    setColors(randomColors);
  };

  useEffect(() => {
    const n = Math.floor(Math.random() * 3) + 5;
    setPawPrints(n);
    randomizeColors(n);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // get random position on the screen using window.innerWidth and window.innerHeight but not more than 50% of the screen
  useEffect(() => {
    const interval = setInterval(() => {
      if (containerRef.current !== null) {
        containerRef.current.classList.toggle(styles.hidden);
        [...containerRef.current.children].forEach(child => {
          child.classList.remove(styles.animating);
        });
        const n = Math.floor(Math.random() * 3) + 5;
        setPawPrints(n);
        setTimeout(() => {
          randomizeColors(n);
          const randomLeft = Math.floor(
            // Math.random() * (window.innerWidth / 2 - padSize * padWidthRatio),
            // 2.5 - width of 2 paw prints and a little padding
            Math.random() * (window.innerWidth - padSize * padWidthRatio * 2.5),
          );
          const randomTop = Math.floor(
            Math.random() * (window.innerHeight - padSize * padWidthRatio * n),
          );
          if (containerRef.current) {
            containerRef.current.classList.toggle(styles.hidden);
            [...containerRef.current.children].forEach(child => {
              child.classList.add(styles.animating);
            });
            containerRef.current.style.left = `${randomLeft}px`;
            containerRef.current.style.top = `${randomTop}px`;
          }
        }, POSITION_RANDOMIZE_DELAY);
      }
    }, PAW_ANIMATION_DURATION * 1000 + POSITION_RANDOMIZE_DELAY);
    // }, (PAW_ANIMATION_DURATION + pawPrints * PAW_ANIMATION_DURATION_DELTA) * 1000 + 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.container} ref={containerRef}>
      {[...Array(pawPrints)].map((_, index) => {
        return (
          <div
            key={index}
            className={cn(styles['paw-print'])}
            style={{
              ...getTailwindAnimationClassDependOnPawIndex(
                padSize * padWidthRatio,
                index,
                pawPrints,
              ),
            }}>
            <PawPrint bgColorCN={colors[index]} />
          </div>
        );
      })}
    </div>
  );
};

export default PawPrintAnimation;
