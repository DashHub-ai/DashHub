import { concatUrlParts } from '@dashhub/commons';

import type { TokensStorage } from './auth';

type EndpointAttrs = {
  prefix?: boolean;
};

export type AbstractNestedSdkConfig = {
  apiUrl: string;
  getTokensStorage: () => TokensStorage;
};

export abstract class AbstractNestedSdk<
  C extends AbstractNestedSdkConfig = AbstractNestedSdkConfig,
> {
  protected endpointPrefix = '';

  readonly config: C;

  constructor(config: C) {
    this.config = config;
  }

  get tokensStorage() {
    return this.config.getTokensStorage();
  }

  protected endpoint = (path: string, { prefix = true }: EndpointAttrs = {}) =>
    concatUrlParts(
      this.config.apiUrl,
      prefix ? this.endpointPrefix : '',
      path,
    );
}
