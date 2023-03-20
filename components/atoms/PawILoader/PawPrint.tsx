import React from 'react';
import styles from './PawPrint.module.scss';

const PawPrint = () => {
  return (
    <div className={styles['paw-print-1']}>
      <div className={styles['pad large']}></div>
      <div className={styles['pad small-1']}></div>
      <div className={styles['pad small-2']}></div>
      <div className={styles['pad small-3']}></div>
      <div className={styles['pad small-4']}></div>
    </div>
  );
};

export default PawPrint;
