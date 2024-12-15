import { AbstractNestedSdkWithAuth } from '~/modules/abstract-nested-sdk-with-auth';
import {
  getPayload,
  patchPayload,
  postPayload,
  putPayload,
  type SdkRecordAlreadyExistsError,
  type SdkRecordNotFoundError,
  type SdkTableRowIdT,
  type SdkTableRowWithIdT,
} from '~/shared';

import type {
  SdkCreateProjectInputT,
  SdkCreateProjectOutputT,
  SdkProjectT,
  SdKSearchProjectsInputT,
  SdKSearchProjectsOutputT,
  SdkUpdateProjectInputT,
  SdkUpdateProjectOutputT,
} from './dto';

import { ProjectsFilesSdk } from './projects-files.sdk';

export class ProjectsSdk extends AbstractNestedSdkWithAuth {
  protected endpointPrefix = '/dashboard/projects';

  readonly files = new ProjectsFilesSdk(this.config);

  get = (id: SdkTableRowIdT) =>
    this.fetch<SdkProjectT>({
      url: this.endpoint(`/${id}`),
      options: getPayload(),
    });

  search = (data: SdKSearchProjectsInputT) =>
    this.fetch<SdKSearchProjectsOutputT>({
      url: this.endpoint('/search'),
      query: data,
      options: getPayload(),
    });

  create = (data: SdkCreateProjectInputT) =>
    this.fetch<SdkCreateProjectOutputT, SdkRecordAlreadyExistsError>({
      url: this.endpoint('/'),
      options: postPayload(data),
    });

  unarchive = (id: SdkTableRowIdT) =>
    this.fetch<
      SdkTableRowWithIdT,
      SdkRecordNotFoundError | SdkRecordAlreadyExistsError
    >({
      url: this.endpoint(`/unarchive/${id}`),
      options: patchPayload({}),
    });

  archive = (id: SdkTableRowIdT) =>
    this.fetch<
      SdkTableRowWithIdT,
      SdkRecordNotFoundError | SdkRecordAlreadyExistsError
    >({
      url: this.endpoint(`/archive/${id}`),
      options: patchPayload({}),
    });

  update = ({ id, ...data }: SdkUpdateProjectInputT & SdkTableRowWithIdT) =>
    this.fetch<
      SdkUpdateProjectOutputT,
      SdkRecordAlreadyExistsError | SdkRecordNotFoundError
    >({
      url: this.endpoint(`/${id}`),
      options: putPayload(data),
    });
};
