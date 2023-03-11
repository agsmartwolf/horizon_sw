// https://github.com/vercel/next.js/tree/canary/examples/with-zustand
import type { HeaderProps } from 'components/organisms/Header';
import type { FooterProps } from 'components/organisms/Footer/Footer';
import type { SocialLinks } from 'types/shared/socials';
import type { Fonts } from 'build-utils/fonts.test';
import { useLayoutEffect } from 'react';
import create from 'zustand';
import { devtools } from 'zustand/middleware';
import createContext from 'zustand/context';

export type Colors = { [key: string]: string | { [key: string]: string } };
export type Typography = {
  fontSize: { base: number; scaling: number };
  fontFamily: Fonts;
};
export type Borders = { image: { radius: number } };
type AccountSettings = {
  header: {
    hideOnScroll: true;
  };
};

export interface Settings {
  colors: Colors;
  typography: Typography;
  borders: Borders;
  header: HeaderProps;
  footer: FooterProps;
  socialLinks: SocialLinks;
  lang: any;
  account: AccountSettings;
}

interface SettingsState {
  settings: Settings | null;
  setSettings: (settings: Settings) => void;
  setSetting: (path: string, value: any) => Promise<void>;
}

let store: ReturnType<typeof initializeSettingsStore>;

const getDefaultInitialState = () =>
  ({
    settings: null,
    setSettings: () => {},
    setSetting: () => Promise.resolve(),
  } as SettingsState);

const zustandContext = createContext<SettingsState>();

export const SettingsProvider = zustandContext.Provider;
// An example of how to still gets types in JS
/** @type {import('zustand/index').UseStore<typeof initialState>} */
export const useSettingsStore = zustandContext.useStore;

export const initializeSettingsStore = (preloadedState = {}) => {
  const cbStore = (set: any) => ({
    ...getDefaultInitialState(),
    ...preloadedState,
    setSettings: (settings: Settings) => {
      set((state: SettingsState) => {
        if (state.settings) {
          return {
            settings: { ...state.settings, ...settings },
          };
        }
        return { settings };
      });
    },
    setSetting: async (path: string, value: any) => {
      const [setValue, toCamelCase] = await Promise.all([
        import('lodash.set').then(data => data.default),
        import('lodash.camelcase').then(data => data.default),
      ]);
      const newPath = path.split('.').map(toCamelCase).join('.');
      set((state: SettingsState) => {
        const settings = structuredClone(state.settings);
        if (!settings) return state;
        setValue(settings, newPath, value);
        return {
          settings,
        };
      });
    },
  });
  return create<SettingsState>(
    process.env.NODE_ENV === 'development' ? devtools(cbStore) : cbStore,
  );
};

export function useCreateSettingsStore(serverInitialState: SettingsState) {
  // Server side code: For SSR & SSG, always use a new store.
  if (typeof window === 'undefined') {
    return () => initializeSettingsStore(serverInitialState);
  }
  // End of server side code

  // Client side code:
  // Next.js always re-uses same store regardless of
  // whether page is a SSR or SSG or CSR type.
  const isReusingStore = Boolean(store);
  store = store ?? initializeSettingsStore(serverInitialState);
  // So if next re-renders _app while re-using an older store,
  // then merge states in the next render cycle.
  // (Why next render cycle? Because react cannot re-render
  // while a render is already in progress. i.e. we cannot
  // do a setState() as that will initiate a re-render)
  //
  // eslint complaining "React Hooks must be called in the exact same order in every component render"
  // is ignorable as this code runs in same order in a given environment (i.e. client or server)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useLayoutEffect(() => {
    if (isReusingStore) {
      store.setState(
        {
          // re-use functions from existing store
          ...store.getState(),
          // but reset all other properties.
          // serverInitialState is undefined for CSR pages
          ...(serverInitialState || getDefaultInitialState()),
        },
        true,
      );
    }
  });

  return () => store;
}

export default useSettingsStore;
