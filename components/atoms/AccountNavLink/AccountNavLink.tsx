import React from 'react';
import Link from 'next/link';
import cn from 'classnames';

export interface AccountNavLinkProps {
  label: string;
  link: string;
  active?: boolean;
}

const AccountNavLink: React.FC<AccountNavLinkProps> = ({
  link,
  label,
  active,
}) => (
  <Link
    href={link}
    className={cn(
      'decoration-skip-ink-none text-md text-body hover:underline md:font-bold md:text-black',
      {
        underline: !!active,
      },
    )}>
    {label}
  </Link>
);

export default AccountNavLink;
