import { isSessionTokenValid } from './authentication';
import type { GetServerSidePropsContext, Redirect } from 'next';
import type { AuthLayoutProps } from 'page_layouts/AuthLayout';
import type { MainLayoutProps } from 'page_layouts/MainLayout';
import { getClientWithSessionToken, getRawClient } from 'lib/graphql/client';
import { getStoreSettings } from 'lib/shop/fetchingFunctions';
import { initializeSettingsStore } from '../../stores/settings';

type GetPropsResult<P> =
  | { props: P | Promise<P> }
  | { redirect: Redirect }
  | { notFound: true };

type GetProps<P> = (
  context: never,
) => GetPropsResult<P> | Promise<GetPropsResult<P>>;

type GetPropsType<T> = T extends GetProps<infer P> ? P : never;

type DecoratorFunctionReturn<T, P extends GetProps<unknown>> = Promise<
  GetPropsResult<T & GetPropsType<P>>
>;

export function withMainLayout<C extends GetProps<unknown>>(callback: C) {
  return async (
    context: Record<string, unknown>,
  ): DecoratorFunctionReturn<{ _layout: MainLayoutProps }, C> => {
    const result = (await callback(context as never)) as any;

    if (!result.props) {
      return result;
    }

    const allSettings = await getStoreSettings(result.props.locale);
    const { currencies, locales, ...settings } = allSettings;
    const settingsStore = initializeSettingsStore({ settings: allSettings });

    return {
      ...result,
      props: {
        ...result.props,
        _layout: {
          settings,
          locales,
          currencies,
        },
        // the "stringify and then parse again" piece is required as next.js
        // isn't able to serialize it to JSON properly
        initialSettingsState: JSON.parse(
          JSON.stringify(settingsStore.getState()),
        ),
      },
    };
  };
}

export function withAuthLayout<C extends GetProps<unknown>>(callback: C) {
  return async (
    context: Record<string, unknown>,
  ): DecoratorFunctionReturn<{ _layout: AuthLayoutProps }, C> => {
    const result = (await callback(context as never)) as any;

    if (!result.props) {
      return result;
    }

    const settings = await getStoreSettings(result.props.locale);
    const settingsStore = initializeSettingsStore({ settings });

    const finalProps = {
      ...result,
      props: {
        ...result.props,
        _layout: {
          settings,
        },
        // the "stringify and then parse again" piece is required as next.js
        // isn't able to serialize it to JSON properly
        initialSettingsState: JSON.parse(
          JSON.stringify(settingsStore.getState()),
        ),
      },
    };
    return finalProps;
  };
}

export function withAuthentication<C extends GetProps<unknown>>(callback: C) {
  return async (
    context: GetServerSidePropsContext,
  ): Promise<GetPropsResult<C>> => {
    const { sessionToken } = context.req.cookies;
    const rawClient = getRawClient();
    if (
      !sessionToken ||
      !(await isSessionTokenValid(sessionToken, rawClient))
    ) {
      return {
        redirect: {
          destination: '/account/login',
          permanent: false,
        },
      };
    }

    return (await callback(context as never)) as GetPropsResult<C>;
  };
}

export function withAccountLayout<C extends GetProps<unknown>>(callback: C) {
  return async (
    context: Record<string, unknown>,
  ): DecoratorFunctionReturn<{ _layout: MainLayoutProps }, C> => {
    const result = (await callback(context as never)) as any;
    const client = getClientWithSessionToken(
      (context?.req as GetServerSidePropsContext['req'])?.cookies,
    );

    const {
      data: { account },
    } = await client.getAccountDetails();

    if (!result.props) {
      return result;
    }

    const settings = await getStoreSettings(result.props.locale);
    const settingsStore = initializeSettingsStore({ settings });

    return {
      ...result,
      props: {
        ...result.props,
        _layout: {
          accountDetails: account,
          settings,
        },
        // the "stringify and then parse again" piece is required as next.js
        // isn't able to serialize it to JSON properly
        initialSettingsState: JSON.parse(
          JSON.stringify(settingsStore.getState()),
        ),
      },
    };
  };
}
