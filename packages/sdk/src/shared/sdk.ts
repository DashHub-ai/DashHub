import { AuthSdk } from '~/modules';

import type { AbstractNestedSdkConfig } from '../modules/abstract-nested-sdk';

export class Sdk {
  readonly auth: AuthSdk;

  constructor(config: AbstractNestedSdkConfig) {
    this.auth = new AuthSdk(config);
  }
}
