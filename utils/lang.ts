import type { AccountNavLinkProps } from 'components/atoms/AccountNavLink';
import type { I18n, LocaleCode } from 'hooks/useI18n';

export const pageTitleMap = (i18n: I18n<LocaleCode>) => ({
  subscriptions: i18n('account.subscriptions.title'),
  orders: i18n('account.orders.title'),
});

export const accountLinks = (i18n: I18n<LocaleCode>): AccountNavLinkProps[] => [
  {
    label: i18n('account.subscriptions.navigation_title'),
    link: '/account/subscriptions',
  },
  {
    label: i18n('account.orders.navigation_title'),
    link: '/account/orders',
  },
];
