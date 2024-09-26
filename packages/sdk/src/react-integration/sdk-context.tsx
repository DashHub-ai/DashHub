import { createContext } from 'react';

import type { AuthSdk, DashboardSdk, JWTTokenT } from '~/modules';

export type SdkContextSessionT =
  | {
    isLoggedIn: false;
  }
  | {
    isLoggedIn: true;
    token: JWTTokenT;
  };

export type SdkContextT = {
  session: SdkContextSessionT;
  sdks: {
    auth: AuthSdk;
    dashboard: DashboardSdk;
  };
};

export const SdkContext = createContext<SdkContextT | null>(null);
