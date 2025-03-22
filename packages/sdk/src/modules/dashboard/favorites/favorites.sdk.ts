import { AbstractNestedSdkWithAuth } from '~/modules/abstract-nested-sdk-with-auth';
import { postPayload, type SdkSuccessT } from '~/shared';

import type { SdkFavoriteT, SdkUpsertFavoriteT } from './dto';

export class FavoritesSdk extends AbstractNestedSdkWithAuth {
  protected endpointPrefix = '/dashboard/favorites';

  all = () =>
    this.fetch<SdkFavoriteT[]>({
      url: this.endpoint('/'),
    });

  upsert = (data: SdkUpsertFavoriteT) =>
    this.fetch<SdkSuccessT>({
      url: this.endpoint('/'),
      options: postPayload(data),
    });
};
