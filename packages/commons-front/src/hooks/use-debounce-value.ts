import { useState } from 'react';

import type { AsyncDebounceConfig } from '@dashhub/commons';

import { useAsyncCallback } from './use-async-callback';
import { useAsyncDebounce } from './use-async-debounce';
import { useInstantUpdateEffect } from './use-instant-update-effect';

type DebounceValueConfig<T> = AsyncDebounceConfig & {
  shouldSetInstantlyIf?: (prevValue: T, newValue: T) => boolean;
};

export function useDebounceValue<T>(
  { shouldSetInstantlyIf, ...config }: DebounceValueConfig<T>,
  value: T,
  key: any = value,
) {
  const [debouncedValue, setValue] = useState(value);
  const [setDebouncedValue, { status }] = useAsyncCallback(
    useAsyncDebounce(
      setValue,
      config,
    ),
  );

  useInstantUpdateEffect(() => {
    if (shouldSetInstantlyIf?.(debouncedValue, value)) {
      setValue(value);
    }
    else if (debouncedValue !== value) {
      void setDebouncedValue(value);
    }
  }, [key]);

  return {
    value: debouncedValue,
    loading: status === 'loading',
  };
}
