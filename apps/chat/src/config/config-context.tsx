import { createContext, type PropsWithChildren, useMemo } from 'react';

import { useContextOrThrow } from '@dashhub/commons-front';

import type { ConfigT } from './config.dto';

import { tryReadEnvOrPanic } from './try-read-env-or-panic';

export const ConfigContext = createContext<ConfigT | null>(null);

export const useConfig = () => useContextOrThrow(ConfigContext, 'Missing config context!');

export function ConfigProvider({ children }: PropsWithChildren) {
  const config = useMemo(() => tryReadEnvOrPanic(), []);

  return (
    <ConfigContext value={config}>
      {children}
    </ConfigContext>
  );
}
