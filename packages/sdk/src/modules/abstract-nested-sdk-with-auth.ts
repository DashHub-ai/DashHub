import type { AuthAsyncFetcher } from './auth/auth-async-fetcher';

import { AbstractNestedSdk, type AbstractNestedSdkConfig } from './abstract-nested-sdk';

export type AbstractNestedSdkWithAuthConfig = AbstractNestedSdkConfig & {
  authAsyncFetcher: AuthAsyncFetcher;
};

export abstract class AbstractNestedSdkWithAuth<
  C extends AbstractNestedSdkWithAuthConfig = AbstractNestedSdkWithAuthConfig,
> extends AbstractNestedSdk<C> {
  constructor(config: C) {
    super(config);
  }

  get authAsyncFetcher() {
    return this.config.authAsyncFetcher;
  }
}
