import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import {
  type EvalsSdk,
  SdkCreateEvalCaseInputV,
  SdkCreateEvalRunInputV,
  SdkCreateEvalSuiteInputV,
} from '@dashhub/sdk';
import { ConfigService } from '~/modules/config';
import { EvalsService } from '~/modules/evals';

import {
  mapDbRecordNotFoundToSdkError,
  rejectUnsafeSdkErrors,
  sdkSchemaValidator,
  serializeSdkResponseTE,
} from '../../helpers';
import { AuthorizedController } from '../shared/authorized.controller';

@injectable()
export class EvalsController extends AuthorizedController {
  constructor(
    @inject(ConfigService) configService: ConfigService,
    @inject(EvalsService) evalsService: EvalsService,
  ) {
    super(configService);

    this.router
      .post(
        '/suites',
        sdkSchemaValidator('json', SdkCreateEvalSuiteInputV),
        async context => pipe(
          context.req.valid('json'),
          evalsService.asUser(context.var.jwt).createSuite,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<EvalsSdk['createSuite']>>(context),
        ),
      )
      .get(
        '/suites/by-org/:organizationId',
        async context => pipe(
          Number(context.req.param().organizationId),
          evalsService.asUser(context.var.jwt).listSuites,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<EvalsSdk['listSuites']>>(context),
        ),
      )
      .post(
        '/cases',
        sdkSchemaValidator('json', SdkCreateEvalCaseInputV),
        async context => pipe(
          context.req.valid('json'),
          evalsService.asUser(context.var.jwt).createCase,
          mapDbRecordNotFoundToSdkError,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<EvalsSdk['createCase']>>(context),
        ),
      )
      .get(
        '/cases/by-suite/:suiteId',
        async context => pipe(
          Number(context.req.param().suiteId),
          evalsService.asUser(context.var.jwt).listCases,
          mapDbRecordNotFoundToSdkError,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<EvalsSdk['listCases']>>(context),
        ),
      )
      .post(
        '/runs',
        sdkSchemaValidator('json', SdkCreateEvalRunInputV),
        async context => pipe(
          context.req.valid('json'),
          evalsService.asUser(context.var.jwt).createRun,
          mapDbRecordNotFoundToSdkError,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<EvalsSdk['createRun']>>(context),
        ),
      )
      .get(
        '/runs/by-suite/:suiteId',
        async context => pipe(
          Number(context.req.param().suiteId),
          evalsService.asUser(context.var.jwt).listRuns,
          mapDbRecordNotFoundToSdkError,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<EvalsSdk['listRuns']>>(context),
        ),
      )
      .get(
        '/results/by-run/:runId',
        async context => pipe(
          Number(context.req.param().runId),
          evalsService.asUser(context.var.jwt).listResults,
          mapDbRecordNotFoundToSdkError,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<EvalsSdk['listResults']>>(context),
        ),
      );
  }
}
