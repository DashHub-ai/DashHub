import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

import { AbstractNestedSdkWithAuth } from '~/modules/abstract-nested-sdk-with-auth';
import {
  getPayload,
  patchPayload,
  postPayload,
  putPayload,
  type SdkRecordAlreadyExistsError,
  SdkRecordNotFoundError,
  type SdkTableRowIdT,
  type SdkTableRowUuidT,
  type SdkTableRowWithIdT,
} from '~/shared';

import type {
  SdkAppFromChatT,
  SdkAppT,
  SdkCreateAppInputT,
  SdkCreateAppOutputT,
  SdkSearchAppsInputT,
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

  getAppCreatorApp = () =>
    pipe(
      this.search({
        phrase: 'App Creator',
        archived: false,
        offset: 0,
        limit: 1,
        sort: 'createdAt:desc',
      }),
      TE.map(({ items }) => items[0]),
      TE.chainW((item) => {
        if (!item) {
          return TE.left(new SdkRecordNotFoundError({ id: 'App Creator' }));
        }

        return TE.right(item);
      }),
    );

  search = (data: SdkSearchAppsInputT) =>
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
