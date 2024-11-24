import type {
  SdkRecordAlreadyExistsError,
  SdkRecordNotFoundError,
  SdkTableRowUuidT,
  SdkTableRowWithUuidT,
} from '~/shared';

import { AbstractNestedSdkWithAuth } from '~/modules/abstract-nested-sdk-with-auth';
import { getPayload, patchPayload, postPayload } from '~/shared';

import type {
  SdkCreateMessageInputT,
  SdKSearchMessagesInputT,
  SdKSearchMessagesOutputT,
} from '../messages';
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

  unarchive = (id: SdkTableRowUuidT) =>
    this.fetch<
      SdkTableRowWithUuidT,
      SdkRecordNotFoundError | SdkRecordAlreadyExistsError
    >({
      url: this.endpoint(`/unarchive/${id}`),
      options: patchPayload({}),
    });

  archive = (id: SdkTableRowUuidT) =>
    this.fetch<
      SdkTableRowWithUuidT,
      SdkRecordNotFoundError | SdkRecordAlreadyExistsError
    >({
      url: this.endpoint(`/archive/${id}`),
      options: patchPayload({}),
    });

  searchMessages = (
    chatId: SdkTableRowUuidT,
    data: Omit<SdKSearchMessagesInputT, 'chatIds'>,
  ) =>
    this.fetch<SdKSearchMessagesOutputT>({
      url: this.endpoint(`/${chatId}/messages`),
      query: data,
      options: getPayload(),
    });

  createMessage = (chatId: SdkTableRowUuidT, data: SdkCreateMessageInputT) =>
    this.fetch<SdkTableRowWithUuidT>({
      url: this.endpoint(`/${chatId}/messages`),
      options: postPayload(data),
    });
};
