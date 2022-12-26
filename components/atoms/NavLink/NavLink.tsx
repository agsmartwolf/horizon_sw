import React from 'react';
import Link from 'next/link';

export interface NavLinkProps extends React.HTMLAttributes<HTMLLIElement> {
  label: string;
  link: string;
}

const NavLink: React.FC<NavLinkProps> = ({ label, link }) => {
  return (
    <li className="list-none">
      <Link href={link}>
        <a className="text-md font-semibold capitalize text-white">{label}</a>
      </Link>
    </li>
  );
};

export default NavLink;
