import { AbstractNestedSdkWithAuth } from '~/modules/abstract-nested-sdk-with-auth';
import { deletePayload, getPayload, postPayload, type SdkSuccessT } from '~/shared';

import type { SdkFavoriteT, SdkSearchAllFavoritesInputT, SdkUpsertFavoriteInputT } from './dto';

export class FavoritesSdk extends AbstractNestedSdkWithAuth {
  protected endpointPrefix = '/dashboard/favorites';

  upsert = (data: SdkUpsertFavoriteInputT) =>
    this.fetch<SdkSuccessT>({
      url: this.endpoint('/'),
      options: postPayload(data),
    });

  delete = (data: SdkUpsertFavoriteInputT) =>
    this.fetch<SdkSuccessT>({
      url: this.endpoint('/'),
      options: deletePayload(data),
    });

  all = (filters: SdkSearchAllFavoritesInputT) =>
    this.fetch<SdkFavoriteT[]>({
      url: this.endpoint('/all'),
      query: filters,
      options: getPayload(),
    });
};
