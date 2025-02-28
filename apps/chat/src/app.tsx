import { HelmetProvider } from 'react-helmet-async';

import { ModalsContextProvider } from '@llm/commons-front';
import { SdkMeProvider, SdkPinnedMessagesProvider, SdkProvider } from '@llm/sdk';
import { useConfig } from '~/config';
import { I18nProvider } from '~/i18n';
import { Router } from '~/router';

import { FavoriteAppsValidator, WorkspaceProvider } from './modules';

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
            <I18nProvider>
              <WorkspaceProvider>
                <ModalsContextProvider>
                  <FavoriteAppsValidator />
                  <Router />
                </ModalsContextProvider>
              </WorkspaceProvider>
            </I18nProvider>
          </SdkPinnedMessagesProvider>
        </SdkMeProvider>
      </SdkProvider>
    </HelmetProvider>
  );
}
