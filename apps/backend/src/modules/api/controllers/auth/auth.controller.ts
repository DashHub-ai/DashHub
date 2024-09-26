import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import { type AuthSdk, SdkPasswordLoginInputV, SdkRefreshJWTInputV } from '@llm/sdk';
import { AuthJWTService, AuthPasswordLoginService } from '~/modules/auth';

import { rejectUnsafeSdkErrors, sdkSchemaValidator, serializeSdkResponseTE } from '../../helpers';
import { BaseController } from '../base.controller';

@injectable()
export class AuthController extends BaseController {
  constructor(
    @inject(AuthPasswordLoginService) passwordLoginService: AuthPasswordLoginService,
    @inject(AuthJWTService) jwtService: AuthJWTService,
  ) {
    super();

    this.router
      .post(
        '/login/password',
        sdkSchemaValidator('json', SdkPasswordLoginInputV),
        async context => pipe(
          context.req.valid('json'),
          passwordLoginService.login,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<AuthSdk['passwordLogin']>>(context),
        ),
      )
      .post(
        '/login/refresh',
        sdkSchemaValidator('json', SdkRefreshJWTInputV),
        async context => pipe(
          context.req.valid('json').refreshToken,
          jwtService.refreshToken,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<AuthSdk['rawRefreshToken']>>(context),
        ),
      );
  }
}
