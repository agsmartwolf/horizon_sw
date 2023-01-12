import React from 'react';
import Link from 'next/link';
import useClassNames from "../../../hooks/useClassNames";

export interface NavLinkProps extends React.HTMLAttributes<HTMLLIElement> {
  label?: string;
  children?: React.ReactNode;
  link: string;
  className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({
  label,
  link = '#',
  className = '',
  children,
}) => {
  const classN = useClassNames(
    'text-md capitalize text-white pb-1 hover:border-b-2 border-white',
    className,
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
