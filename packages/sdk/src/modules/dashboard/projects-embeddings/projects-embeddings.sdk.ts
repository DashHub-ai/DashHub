import { AbstractNestedSdkWithAuth } from '~/modules/abstract-nested-sdk-with-auth';
import { getPayload, type SdkRecordNotFoundError, type SdkTableRowIdT } from '~/shared';

import type {
  SdkSearchProjectEmbeddingItemT,
  SdkSearchProjectEmbeddingsInputT,
  SdkSearchProjectEmbeddingsOutputT,
} from './dto';

export class ProjectsEmbeddingsSdk extends AbstractNestedSdkWithAuth {
  protected endpointPrefix = '/dashboard/projects/embeddings';

  get = (id: SdkTableRowIdT) =>
    this.fetch<SdkSearchProjectEmbeddingItemT, SdkRecordNotFoundError>({
      url: this.endpoint(`/${id}`),
      options: getPayload(),
    });

  search = (attrs: SdkSearchProjectEmbeddingsInputT) =>
    this.fetch<SdkSearchProjectEmbeddingsOutputT>({
      url: this.endpoint('/search'),
      query: attrs,
      options: getPayload(),
    });
};
