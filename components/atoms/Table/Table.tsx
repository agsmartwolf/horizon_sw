import cn from 'classnames';
import React from 'react';
// import { useViewport } from '../../../hooks/useViewport';
import styles from './Table.module.scss';

const Table = React.forwardRef<
  HTMLTableElement,
  React.TableHTMLAttributes<HTMLTableElement> & { data: Array<Array<string>> }
>((props, ref) => {
  // const { isMobile } = useViewport();
  const classNames = cn(styles.table, props.className, {
    [styles.vertical]: false,
  });

  return (
    <table ref={ref} className={classNames}>
      <thead>
        <tr>
          {props.data[0].map((th, index) => (
            <th key={index}>{th}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.data.slice(1).map((row, index) => (
          <tr key={index}>
            {row.map((cell, index) => (
              <td key={index}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
});

Table.displayName = 'Table';

export default Table;
