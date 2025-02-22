import { AbstractNestedSdkWithAuth } from '~/modules/abstract-nested-sdk-with-auth';
import {
  deletePayload,
  getPayload,
  postPayload,
  type SdkRecordAlreadyExistsError,
  type SdkRecordNotFoundError,
  type SdkTableRowIdT,
  type SdkTableRowWithIdT,
} from '~/shared';

import type {
  SdkPinMessageInputT,
  SdkSearchPinnedMessagesInputT,
  SdkSearchPinnedMessagesOutputT,
} from './dto';

export class PinnedMessagesSdk extends AbstractNestedSdkWithAuth {
  protected endpointPrefix = '/dashboard/pinned-messages';

  search = (data: SdkSearchPinnedMessagesInputT) =>
    this.fetch<SdkSearchPinnedMessagesOutputT>({
      url: this.endpoint('/search'),
      query: data,
      options: getPayload(),
    });

  create = (dto: SdkPinMessageInputT) =>
    this.fetch<
      SdkTableRowWithIdT,
      SdkRecordNotFoundError | SdkRecordAlreadyExistsError
    >({
      url: this.endpoint('/'),
      options: postPayload(dto),
    });

  delete = (id: SdkTableRowIdT) =>
    this.fetch<
      SdkTableRowWithIdT,
      SdkRecordNotFoundError | SdkRecordAlreadyExistsError
    >({
      url: this.endpoint(`/${id}`),
      options: deletePayload({}),
    });
};
