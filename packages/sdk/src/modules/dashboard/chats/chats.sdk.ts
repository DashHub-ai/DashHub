import type {
  SdkRecordAlreadyExistsError,
  SdkRecordNotFoundError,
  SdkTableRowIdT,
  SdkTableRowUuidT,
  SdkTableRowWithUuidT,
} from '~/shared';

import { AbstractNestedSdkWithAuth } from '~/modules/abstract-nested-sdk-with-auth';
import { getPayload, patchPayload, postPayload } from '~/shared';

import type { SdkCreateMessageInputT } from '../messages';
import type {
  SdkChatT,
  SdkCreateChatInputT,
  SdkCreateChatOutputT,
  SdKSearchChatsInputT,
  SdKSearchChatsOutputT,
} from './dto';

export class ChatsSdk extends AbstractNestedSdkWithAuth {
  protected endpointPrefix = '/dashboard/chats';

  get = (id: SdkTableRowUuidT) =>
    this.fetch<SdkChatT>({
      url: this.endpoint(`/${id}`),
      options: getPayload(),
    });

  search = (data: SdKSearchChatsInputT) =>
    this.fetch<SdKSearchChatsOutputT>({
      url: this.endpoint('/search'),
      query: data,
      options: getPayload(),
    });

  create = (data: SdkCreateChatInputT) =>
    this.fetch<SdkCreateChatOutputT>({
      url: this.endpoint('/'),
      options: postPayload(data),
    });

  archive = (id: SdkTableRowIdT) =>
    this.fetch<
      SdkTableRowWithUuidT,
      SdkRecordNotFoundError | SdkRecordAlreadyExistsError
    >({
      url: this.endpoint(`/archive/${id}`),
      options: patchPayload({}),
    });

  createMessage = (chatId: SdkTableRowIdT, data: SdkCreateMessageInputT) =>
    this.fetch<SdkTableRowWithUuidT>({
      url: this.endpoint(`/${chatId}/messages`),
      options: postPayload(data),
    });
};
