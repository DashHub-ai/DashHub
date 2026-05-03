import { AbstractNestedSdkWithAuth } from '~/modules/abstract-nested-sdk-with-auth';
import {
  getPayload,
  postPayload,
  type SdkRecordNotFoundError,
  type SdkTableRowIdT,
} from '~/shared';

import type {
  SdkCreateEvalCaseInputT,
  SdkCreateEvalCaseOutputT,
  SdkCreateEvalRunInputT,
  SdkCreateEvalRunOutputT,
  SdkCreateEvalSuiteInputT,
  SdkCreateEvalSuiteOutputT,
  SdkEvalCaseT,
  SdkEvalResultT,
  SdkEvalRunT,
  SdkEvalSuiteT,
} from './dto';

export class EvalsSdk extends AbstractNestedSdkWithAuth {
  protected endpointPrefix = '/dashboard/evals';

  createSuite = (data: SdkCreateEvalSuiteInputT) =>
    this.fetch<SdkCreateEvalSuiteOutputT>({
      url: this.endpoint('/suites'),
      options: postPayload(data),
    });

  listSuites = (organizationId: SdkTableRowIdT) =>
    this.fetch<SdkEvalSuiteT[]>({
      url: this.endpoint(`/suites/by-org/${organizationId}`),
      options: getPayload(),
    });

  createCase = (data: SdkCreateEvalCaseInputT) =>
    this.fetch<SdkCreateEvalCaseOutputT>({
      url: this.endpoint('/cases'),
      options: postPayload(data),
    });

  listCases = (suiteId: SdkTableRowIdT) =>
    this.fetch<SdkEvalCaseT[], SdkRecordNotFoundError>({
      url: this.endpoint(`/cases/by-suite/${suiteId}`),
      options: getPayload(),
    });

  createRun = (data: SdkCreateEvalRunInputT) =>
    this.fetch<SdkCreateEvalRunOutputT, SdkRecordNotFoundError>({
      url: this.endpoint('/runs'),
      options: postPayload(data),
    });

  listRuns = (suiteId: SdkTableRowIdT) =>
    this.fetch<SdkEvalRunT[], SdkRecordNotFoundError>({
      url: this.endpoint(`/runs/by-suite/${suiteId}`),
      options: getPayload(),
    });

  listResults = (runId: SdkTableRowIdT) =>
    this.fetch<SdkEvalResultT[], SdkRecordNotFoundError>({
      url: this.endpoint(`/results/by-run/${runId}`),
      options: getPayload(),
    });
}
