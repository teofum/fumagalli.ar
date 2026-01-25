import { useCallback, useState } from 'react';

type FetchResult<T> = {
  data: T | null;
  status: number;
};

type FetchState = 'idle' | 'loading';

function useFetch<T>() {
  const [result, setResult] = useState<FetchResult<T> | null>(null);
  const [state, setState] = useState<FetchState>('idle');

  const load = useCallback(async (url: string) => {
    setState('loading');
    const response = await fetch(url);

    const result: FetchResult<T> = { data: null, status: response.status };
    if (response.ok) {
      result.data = (await response.json()) as T;
    }

    setResult(result);
    setState('idle');

    return result;
  }, []);

  return {
    data: result?.data,
    status: result?.status,
    state,
    load,
  };
}

export default useFetch;
