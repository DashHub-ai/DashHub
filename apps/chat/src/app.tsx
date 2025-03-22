import { HelmetProvider } from 'react-helmet-async';

import { ModalsContextProvider } from '@llm/commons-front';
import { SdkFavoritesProvider, SdkMeProvider, SdkPinnedMessagesProvider, SdkProvider } from '@llm/sdk';
import { useConfig } from '~/config';
import { I18nProvider } from '~/i18n';
import { Router } from '~/router';

import { WorkspaceProvider } from './modules';

export function App() {
  const config = useConfig();

  return (
    <HelmetProvider>
      <SdkProvider
        apiUrl={config.apiUrl}
        storageAttrs={{
          storageKey: 'llm-chat-sdk-tokens',
        }}
      >
        <SdkMeProvider>
          <SdkPinnedMessagesProvider>
            <SdkFavoritesProvider>
              <I18nProvider>
                <WorkspaceProvider>
                  <ModalsContextProvider>
                    <Router />
                  </ModalsContextProvider>
                </WorkspaceProvider>
              </I18nProvider>
            </SdkFavoritesProvider>
          </SdkPinnedMessagesProvider>
        </SdkMeProvider>
      </SdkProvider>
    </HelmetProvider>
  );
}
