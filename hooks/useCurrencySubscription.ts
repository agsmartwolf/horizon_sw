import { startTransition, useEffect, useState } from 'react';
import useCurrencyStore from 'stores/currency';

interface CurrencySubscriptionData<T, K> {
  defaultData: T;
  callback: (currency: string) => Promise<K>;
  currencyGetter: (returnData: T) => string;
}

// TODO: Check reactivity if defaultData props change.
export default function useCurrencySubscription<T, K extends T>({
  defaultData,
  callback,
  currencyGetter,
}: CurrencySubscriptionData<T, K>): T {
  const [returnData, setReturnData] = useState<T>();
  const [isFirstlyFetched, setIsFirstlyFetched] = useState(false);
  const [currency, setCurrency] = useState(currencyGetter(defaultData));
  const activeCurrency = useCurrencyStore(state => state.currency);

  useEffect(() => {
    let mounted = true;
    // needed for initial fetch for sync data with SWELL store

    async function fetchData() {
      if (currency !== activeCurrency.code || !isFirstlyFetched) {
        setIsFirstlyFetched(true);
        const newReturnData = await callback(activeCurrency.code);
        if (mounted) {
          setCurrency(currencyGetter(newReturnData));
          setReturnData(newReturnData);
        }
      }
    }
    startTransition(() => {
      fetchData();
    });
    return () => {
      mounted = false;
    };
  }, [
    isFirstlyFetched,
    activeCurrency.code,
    callback,
    currency,
    currencyGetter,
  ]);

  return {
    ...defaultData,
    ...(typeof returnData === 'object' ? returnData : {}),
  };
}
