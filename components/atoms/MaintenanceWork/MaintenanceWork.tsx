import React from 'react';
import styles from './MaintenanceWork.module.scss';
import cn from 'classnames';
import TextHeading from '../Text/TextHeading';
import RichText from '../RichText';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const MaintenanceWork = React.forwardRef<HTMLLabelElement, LabelProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (_, _ref) => {
    return (
      <div className="h-full w-full fixed bg-black-100 flex flex-col items-center justify-center">
        <div className="text-center mb-16">
          <TextHeading
            className="text-green-100 mb-2"
            content={"We've got some special in store for you."}
          />
          <RichText
            rootEl="h2"
            className="text-white text-xl"
            content={
              "We are working like dogs and we can't wait for you to see it."
            }
          />
          <RichText
            className="text-gray-400 text-xl"
            content={'Please check back soon.'}
          />
        </div>
        <div className={styles.container}>
          <div className={styles.corgi}>
            <div className={styles.head}>
              <div className={cn(styles.ear, styles['ear--r'])}></div>
              <div className={cn(styles.ear, styles['ear--l'])}></div>

              <div className={cn(styles.eye, styles['eye--left'])}></div>
              <div className={cn(styles.eye, styles['eye--right'])}></div>

              <div className={styles.face}>
                <div className={styles.face__white}>
                  <div className={styles['face__orange face__orange--l']}></div>
                  <div className={styles['face__orange face__orange--r']}></div>
                </div>
              </div>

              <div className={styles.face__curve}></div>

              <div className={styles.mouth}>
                <div className={styles.nose}></div>
                <div className={styles.mouth__left}>
                  <div className={styles['mouth__left--round']}></div>
                  <div className={styles['mouth__left--sharp']}></div>
                </div>

                <div className={styles.lowerjaw}>
                  <div className={styles.lips}></div>
                  <div className={cn(styles.tongue, styles.test)}></div>
                </div>

                <div className={styles.snout}></div>
              </div>
            </div>

            <div className={styles.neck__back}></div>
            <div className={styles.neck__front}></div>

            <div className={styles.body}>
              <div className={styles.body__chest}></div>
            </div>

            <div
              className={cn(
                styles.foot,
                styles.foot__left,
                styles.foot__front,
                styles.foot__1,
              )}></div>
            <div
              className={cn(
                styles.foot,
                styles.foot__right,
                styles.foot__front,
                styles.foot__2,
              )}></div>
            <div
              className={cn(
                styles.foot,
                styles.foot__left,
                styles.foot__back,
                styles.foot__3,
              )}></div>
            <div
              className={cn(
                styles.foot,
                styles.foot__right,
                styles.foot__back,
                styles.foot__4,
              )}></div>

            <div className={cn(styles.tail, styles.test)}></div>
          </div>
        </div>
      </div>
    );
  },
);

MaintenanceWork.displayName = 'MaintenanceWork';

export default MaintenanceWork;
