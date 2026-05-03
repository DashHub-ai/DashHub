import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

import type {
  SdkCreateEvalCaseInputT,
  SdkCreateEvalRunInputT,
  SdkCreateEvalSuiteInputT,
  SdkJwtTokenT,
} from '@dashhub/sdk';

import { AuthFirewallService } from '~/modules/auth/firewall';

import type { TableId } from '../database';
import type { PermissionsService } from '../permissions';
import type { EvalsService } from './evals.service';

export class EvalsFirewall extends AuthFirewallService {
  constructor(
    jwt: SdkJwtTokenT,
    private readonly evalsService: EvalsService,
    private readonly permissionsService: Readonly<PermissionsService>,
  ) {
    super(jwt);
  }

  createSuite = (dto: SdkCreateEvalSuiteInputT) => pipe(
    this.permissionsService.asUser(this.jwt).enforceOrganizationScope(dto),
    TE.fromEither,
    TE.chainW(this.evalsService.createSuite),
    this.tryTEIfUser.oneOfOrganizationRole('owner', 'tech'),
  );

  listSuites = (organizationId: TableId) => pipe(
    this.permissionsService.asUser(this.jwt).enforceMatchingOrganizationId(organizationId),
    TE.fromEither,
    TE.chainW(() => this.evalsService.listSuites(organizationId)),
  );

  createCase = (dto: SdkCreateEvalCaseInputT) => pipe(
    this.evalsService.getSuite(dto.suiteId),
    TE.chainW(suite =>
      pipe(
        this.permissionsService.asUser(this.jwt).enforceMatchingOrganizationId(suite.organization.id),
        TE.fromEither,
      ),
    ),
    TE.chainW(() => this.evalsService.createCase(dto)),
    this.tryTEIfUser.oneOfOrganizationRole('owner', 'tech'),
  );

  listCases = (suiteId: TableId) => pipe(
    this.evalsService.getSuite(suiteId),
    TE.chainW(suite =>
      pipe(
        this.permissionsService.asUser(this.jwt).enforceMatchingOrganizationId(suite.organization.id),
        TE.fromEither,
      ),
    ),
    TE.chainW(() => this.evalsService.listCases(suiteId)),
  );

  createRun = (dto: SdkCreateEvalRunInputT) => pipe(
    this.evalsService.getSuite(dto.suiteId),
    TE.chainW(suite =>
      pipe(
        this.permissionsService.asUser(this.jwt).enforceMatchingOrganizationId(suite.organization.id),
        TE.fromEither,
      ),
    ),
    TE.chainW(() =>
      this.permissionsService.asUser(this.jwt).findRecordAndCheckOrganizationMatch({
        findRecord: this.evalsService.getAiModel(dto.aiModelId),
      }),
    ),
    TE.chainW(() => this.evalsService.createRun(dto)),
    this.tryTEIfUser.oneOfOrganizationRole('owner', 'tech'),
  );

  listRuns = (suiteId: TableId) => pipe(
    this.evalsService.getSuite(suiteId),
    TE.chainW(suite =>
      pipe(
        this.permissionsService.asUser(this.jwt).enforceMatchingOrganizationId(suite.organization.id),
        TE.fromEither,
      ),
    ),
    TE.chainW(() => this.evalsService.listRuns(suiteId)),
  );

  listResults = (runId: TableId) => pipe(
    this.evalsService.getRun(runId),
    TE.chainW(run => this.evalsService.getSuite(run.suiteId)),
    TE.chainW(suite =>
      pipe(
        this.permissionsService.asUser(this.jwt).enforceMatchingOrganizationId(suite.organization.id),
        TE.fromEither,
      ),
    ),
    TE.chainW(() => this.evalsService.listResults(runId)),
  );
}
