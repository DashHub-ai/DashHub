import { delay, inject, injectable } from 'tsyringe';

import type {
  SdkCreateEvalCaseInputT,
  SdkCreateEvalRunInputT,
  SdkCreateEvalSuiteInputT,
  SdkJwtTokenT,
} from '@dashhub/sdk';

import type { WithAuthFirewall } from '../auth';
import type { TableId } from '../database';

import { AIModelsService } from '../ai-models';
import { PermissionsService } from '../permissions';
import { EvalsFirewall } from './evals.firewall';
import {
  EvalCasesRepo,
  EvalResultsRepo,
  EvalRunsRepo,
  EvalSuitesRepo,
} from './evals.repo';

@injectable()
export class EvalsService implements WithAuthFirewall<EvalsFirewall> {
  constructor(
    @inject(EvalSuitesRepo) private readonly suitesRepo: EvalSuitesRepo,
    @inject(EvalCasesRepo) private readonly casesRepo: EvalCasesRepo,
    @inject(EvalRunsRepo) private readonly runsRepo: EvalRunsRepo,
    @inject(EvalResultsRepo) private readonly resultsRepo: EvalResultsRepo,
    @inject(delay(() => PermissionsService)) private readonly permissionsService: Readonly<PermissionsService>,
    @inject(delay(() => AIModelsService)) private readonly aiModelsService: Readonly<AIModelsService>,
  ) {}

  asUser = (jwt: SdkJwtTokenT) => new EvalsFirewall(jwt, this, this.permissionsService);

  createSuite = (value: SdkCreateEvalSuiteInputT) =>
    this.suitesRepo.create({ value });

  listSuites = (organizationId: TableId) =>
    this.suitesRepo.findByOrganizationId({ organizationId });

  getSuite = (id: TableId) =>
    this.suitesRepo.findById({ id });

  getAiModel = (id: TableId) => this.aiModelsService.get(id);

  createCase = (value: SdkCreateEvalCaseInputT) =>
    this.casesRepo.create({ value });

  listCases = (suiteId: TableId) =>
    this.casesRepo.findBySuiteId({ suiteId });

  createRun = (value: SdkCreateEvalRunInputT) =>
    this.runsRepo.create({ value });

  getRun = (id: TableId) => this.runsRepo.findById({ id });

  listRuns = (suiteId: TableId) =>
    this.runsRepo.findBySuiteId({ suiteId });

  listResults = (runId: TableId) =>
    this.resultsRepo.findByRunId({ runId });
}
