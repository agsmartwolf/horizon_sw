import React from 'react';
import styles from './PawPrint.module.scss';
import cn from 'classnames';

interface IPawPrintProps {
  bgColorCN?: string;
}

const PawPrint = (props: IPawPrintProps) => {
  const { bgColorCN = 'bg-[#654321]' } = props;
  return (
    <div className={styles.pawContainer}>
      <div className={cn(styles.pad, bgColorCN, styles.large)}></div>
      <div className={cn(styles.pad, bgColorCN, styles['small-1'])}></div>
      <div className={cn(styles.pad, bgColorCN, styles['small-2'])}></div>
      <div className={cn(styles.pad, bgColorCN, styles['small-3'])}></div>
      <div className={cn(styles.pad, bgColorCN, styles['small-4'])}></div>
    </div>
  );
};

export default PawPrint;
