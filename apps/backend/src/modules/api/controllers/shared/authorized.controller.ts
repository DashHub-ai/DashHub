import { Hono } from 'hono';

import type { ConfigService } from '~/modules/config';

import { jwtMiddleware, type JWTVariables } from '../../middlewares';

export abstract class AuthorizedController {
  public readonly router: Hono<{
    Variables: JWTVariables;
  }>;

  constructor(configService: ConfigService) {
    this.router = new Hono().use('*', jwtMiddleware(configService.config.auth.jwt.secret));
  }
}
