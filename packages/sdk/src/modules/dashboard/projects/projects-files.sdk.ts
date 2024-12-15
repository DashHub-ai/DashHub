import { AbstractNestedSdkWithAuth } from '~/modules/abstract-nested-sdk-with-auth';
import {
  formDataPayload,
  getPayload,
  type SdkInvalidFileFormatError,
  type SdkRecordAlreadyExistsError,
  type SdkRecordNotFoundError,
  type SdkTableRowIdT,
  type SdkTableRowWithIdT,
} from '~/shared';

import type { SdkSearchProjectFilesInputT, SdKSearchProjectFilesOutputT, SdkUploadProjectFileInputT } from './dto';

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
    this.fetch<SdKSearchProjectFilesOutputT>({
      url: this.endpoint(`/${projectId}/search`),
      query: attrs,
      options: getPayload(),
    });
};
