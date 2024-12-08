import { AbstractNestedSdkWithAuth } from '~/modules/abstract-nested-sdk-with-auth';
import {
  getPayload,
  patchPayload,
  postPayload,
  putPayload,
  type SdkRecordAlreadyExistsError,
  type SdkRecordNotFoundError,
  type SdkTableRowIdT,
  type SdkTableRowUuidT,
  type SdkTableRowWithIdT,
} from '~/shared';

import type {
  SdkAppFromChatT,
  SdkAppT,
  SdkCreateAppInputT,
  SdkCreateAppOutputT,
  SdKSearchAppsInputT,
  SdkSearchAppsOutputT,
  SdkUpdateAppInputT,
  SdkUpdateAppOutputT,
} from './dto';

export class AppsSdk extends AbstractNestedSdkWithAuth {
  protected endpointPrefix = '/dashboard/apps';

  get = (id: SdkTableRowIdT) =>
    this.fetch<SdkAppT, SdkRecordNotFoundError>({
      url: this.endpoint(`/${id}`),
      options: getPayload(),
    });

  search = (data: SdKSearchAppsInputT) =>
    this.fetch<SdkSearchAppsOutputT>({
      url: this.endpoint('/search'),
      query: data,
      options: getPayload(),
    });

  create = (data: SdkCreateAppInputT) =>
    this.fetch<SdkCreateAppOutputT, SdkRecordAlreadyExistsError>({
      url: this.endpoint('/'),
      options: postPayload(data),
    });

  unarchive = (id: SdkTableRowIdT) =>
    this.fetch<
      SdkTableRowWithIdT,
      SdkRecordNotFoundError | SdkRecordAlreadyExistsError
    >({
      url: this.endpoint(`/unarchive/${id}`),
      options: patchPayload({}),
    });

  archive = (id: SdkTableRowIdT) =>
    this.fetch<
      SdkTableRowWithIdT,
      SdkRecordNotFoundError | SdkRecordAlreadyExistsError
    >({
      url: this.endpoint(`/archive/${id}`),
      options: patchPayload({}),
    });

  update = ({ id, ...data }: SdkUpdateAppInputT & SdkTableRowWithIdT) =>
    this.fetch<
      SdkUpdateAppOutputT,
      SdkRecordAlreadyExistsError | SdkRecordNotFoundError
    >({
      url: this.endpoint(`/${id}`),
      options: putPayload(data),
    });

  summarizeChatToApp = (chatId: SdkTableRowUuidT) =>
    this.fetch<SdkAppFromChatT, SdkRecordNotFoundError>({
      url: this.endpoint(`/summarize-chat-to-app/${chatId}`),
      options: getPayload(),
    });
};
