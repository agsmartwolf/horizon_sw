import React from 'react';
import Link from 'next/link';
import cn from 'classnames';

export interface NavLinkProps extends React.HTMLAttributes<HTMLLIElement> {
  label?: string;
  children?: React.ReactNode;
  link: string;
  className?: string;
  capitalize?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({
  label,
  link = '#',
  className = '',
  children,
  capitalize = true,
}) => {
  const classN = cn(
    'text-md text-white pb-1 hover:border-b-2 border-white',
    className,
    {
      capitalize: capitalize,
    },
  );
  return (
    <li className="list-none">
      <Link href={link} className={classN}>
        {label || children}
      </Link>
    </li>
  );
};

export default NavLink;
