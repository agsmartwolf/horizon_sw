import AccountHeader, {
  AccountHeaderProps,
} from 'components/templates/AccountHeader';
import type { ReactNode } from 'react';

export interface AuthLayoutProps {
  header: AccountHeaderProps;
  children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, header }) => (
  <div className="grid min-h-screen grid-rows-[auto_1fr]">
    <AccountHeader {...header} />
    <main className="mx-auto w-full max-w-screen-3xl">{children}</main>
  </div>
);

export default AuthLayout;
