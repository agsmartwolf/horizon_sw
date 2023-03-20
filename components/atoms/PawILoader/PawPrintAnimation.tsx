import React, { useEffect, useState } from 'react';
import styles from './PawPrintAnimation.module.scss';
// import PawPrint from './PawPrint';

const PawPrintAnimation = () => {
  // random number beetween 5 and 8
  // and render PawPrint components with animated delay and transform imitated dog walking

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_pawPrints, setPawPrints] = useState<number>(0);

  useEffect(() => {
    setPawPrints(Math.floor(Math.random() * 3) + 5);
  }, []);

  return <div className={styles.container}></div>;
};

export default PawPrintAnimation;
