import type { PropsWithChildren } from 'react';

import { HelmetProvider } from 'react-helmet-async';

import { ModalsContextProvider } from '@dashhub/commons-front';
import { SdkFavoritesProvider, SdkMeProvider, SdkPinnedMessagesProvider, SdkProvider } from '@dashhub/sdk';
import { useConfig } from '~/config';
import { I18nProvider } from '~/i18n';
import { Router } from '~/router';

import { useWorkspace, WorkspaceProvider } from './modules';

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
                  <FavoritesWithReloader>
                    <Router />
                  </FavoritesWithReloader>
                </ModalsContextProvider>
              </WorkspaceProvider>
            </I18nProvider>
          </SdkPinnedMessagesProvider>
        </SdkMeProvider>
      </SdkProvider>
    </HelmetProvider>
  );
}

function FavoritesWithReloader({ children }: PropsWithChildren) {
  const workspace = useWorkspace();

  return (
    <SdkFavoritesProvider organizationId={workspace.organization?.id}>
      {children}
    </SdkFavoritesProvider>
  );
}
