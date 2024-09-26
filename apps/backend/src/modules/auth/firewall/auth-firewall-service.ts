import { createAccessLevelGuard, type JWTTokenT } from '@llm/sdk';

import { tryTaskEitherIfUser } from './try-task-either-if-user';

export type WithExecAsJWTUserI<A extends AuthFirewallService> = {
  asJWT: (jwt: JWTTokenT) => A;
};

export abstract class AuthFirewallService {
  constructor(protected readonly jwt: JWTTokenT) {}

  protected get userId() {
    return +this.jwt.sub;
  }

  protected get check() {
    return createAccessLevelGuard(this.jwt);
  }

  protected get tryTEIfUser() {
    return tryTaskEitherIfUser(this.jwt);
  }
}
