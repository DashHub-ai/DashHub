import { AbstractNestedSdkWithAuth } from '~/modules/abstract-nested-sdk-with-auth';
import {
  deletePayload,
  formDataPayload,
  getPayload,
  type SdkInvalidFileFormatError,
  type SdkRecordAlreadyExistsError,
  type SdkRecordNotFoundError,
  type SdkSuccessT,
  type SdkTableRowIdT,
  type SdkTableRowWithIdT,
} from '~/shared';

import type {
  SdkSearchProjectFilesInputT,
  SdkSearchProjectFilesOutputT,
  SdkUploadProjectFileInputT,
} from './dto';

export class ProjectsFilesSdk extends AbstractNestedSdkWithAuth {
  protected endpointPrefix = '/dashboard/projects';

  upload = ({ projectId, file }: SdkUploadProjectFileInputT) => {
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

  search = ({ projectId, ...attrs }: SdkSearchProjectFilesInputT & { projectId: SdkTableRowIdT; }) =>
    this.fetch<SdkSearchProjectFilesOutputT>({
      url: this.endpoint(`/${projectId}/files/search`),
      query: attrs,
      options: getPayload(),
    });

  delete = (
    {
      projectId,
      resourceId,
    }: {
      projectId: SdkTableRowIdT;
      resourceId: SdkTableRowIdT;
    },
  ) =>
    this.fetch<SdkSuccessT, SdkRecordNotFoundError>({
      url: this.endpoint(`/${projectId}/files/${resourceId}`),
      options: deletePayload({}),
    });
};
