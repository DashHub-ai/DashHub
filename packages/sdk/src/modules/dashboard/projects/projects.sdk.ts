import { AbstractNestedSdkWithAuth } from '~/modules/abstract-nested-sdk-with-auth';
import {
  formDataPayload,
  getPayload,
  patchPayload,
  postPayload,
  putPayload,
  type SdkInvalidFileFormatError,
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
  SdkUploadProjectFileInputT,
} from './dto';

export class ProjectsSdk extends AbstractNestedSdkWithAuth {
  protected endpointPrefix = '/dashboard/projects';

  uploadFile = ({ projectId, file }: SdkUploadProjectFileInputT) => {
    const formData = new FormData();

    formData.append('file', file);

    return this.fetch<
      SdkTableRowWithIdT,
      SdkRecordNotFoundError | SdkRecordAlreadyExistsError | SdkInvalidFileFormatError
    >({
      url: this.endpoint(`/${projectId}/files`),
      options: formDataPayload('POST')(formData),
    });
  };

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
