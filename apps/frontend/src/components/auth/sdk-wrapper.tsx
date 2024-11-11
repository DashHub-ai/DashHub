import type { ComponentType, PropsWithChildren } from 'react';

import { SdkProvider } from '@llm/sdk';

export function SdkWrapper({ children }: PropsWithChildren) {
  return (
    <SdkProvider
      apiUrl={import.meta.env.PUBLIC_VITE_API_URL}
      storageAttrs={{
        storageKey: 'llm-chat-sdk-tokens',
      }}
    >
      {children}
    </SdkProvider>
  );
}

export function withSdk<T extends object>(Component: ComponentType<T>) {
  return function WithSdkWrapper(props: T) {
    return (
      <SdkWrapper>
        <Component {...props} />
      </SdkWrapper>
    );
  };
}
