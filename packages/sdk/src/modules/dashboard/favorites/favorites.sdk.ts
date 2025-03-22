import { AbstractNestedSdkWithAuth } from '~/modules/abstract-nested-sdk-with-auth';
import { postPayload, type SdkSuccessT } from '~/shared';

import type { SdkUpsertFavoriteInputT } from './dto';

export class FavoritesSdk extends AbstractNestedSdkWithAuth {
  protected endpointPrefix = '/dashboard/favorites';

  upsert = (data: SdkUpsertFavoriteInputT) =>
    this.fetch<SdkSuccessT>({
      url: this.endpoint('/'),
      options: postPayload(data),
    });
};
