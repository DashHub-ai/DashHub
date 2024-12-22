import { AbstractNestedSdkWithAuth } from '~/modules/abstract-nested-sdk-with-auth';
import { getPayload, type SdkTableRowIdT } from '~/shared';

import type {
  SdkSearchProjectEmbeddingsInputT,
  SdKSearchProjectEmbeddingsOutputT,
} from './dto';

export class ProjectsEmbeddingsSdk extends AbstractNestedSdkWithAuth {
  protected endpointPrefix = '/dashboard/projects';

  search = ({ projectId, ...attrs }: SdkSearchProjectEmbeddingsInputT & { projectId: SdkTableRowIdT; }) =>
    this.fetch<SdKSearchProjectEmbeddingsOutputT>({
      url: this.endpoint(`/${projectId}/embeddings/search`),
      query: attrs,
      options: getPayload(),
    });
};
