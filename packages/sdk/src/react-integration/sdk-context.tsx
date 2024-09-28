import { createContext } from 'react';

import type { AuthSdk, DashboardSdk, SdkJwtTokenT } from '~/modules';

export type SdkContextSessionT =
  | {
    isLoggedIn: false;
  }
  | {
    isLoggedIn: true;
    token: SdkJwtTokenT;
  };

export type SdkContextT = {
  session: SdkContextSessionT;
  sdks: {
    auth: AuthSdk;
    dashboard: DashboardSdk;
  };
};

export const SdkContext = createContext<SdkContextT | null>(null);
