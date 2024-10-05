import { HelmetProvider } from 'react-helmet-async';

import { ModalsContextProvider } from '@llm/commons-front';
import { SdkProvider } from '@llm/sdk';
import { useConfig } from '~/config';
import { I18nProvider } from '~/i18n';
import { Router } from '~/router';

export function App() {
  const config = useConfig();

  return (
    <HelmetProvider>
      <SdkProvider apiUrl={config.apiUrl}>
        <I18nProvider>
          <ModalsContextProvider>
            <Router />
          </ModalsContextProvider>
        </I18nProvider>
      </SdkProvider>
    </HelmetProvider>
  );
}
