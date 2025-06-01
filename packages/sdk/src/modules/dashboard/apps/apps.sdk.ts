import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

import { AbstractNestedSdkWithAuth } from '~/modules/abstract-nested-sdk-with-auth';
import {
  formDataPayload,
  getPayload,
  jsonToFormData,
  patchPayload,
  postPayload,
  type SdkInvalidFileFormatError,
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
  SdkInstallAgentsLibraryAgentInputT,
  SdkInstalledAppMetadataT,
  SdkSearchAppsInputT,
  SdkSearchAppsOutputT,
  SdkSearchInstalledAppsMetadataInputT,
  SdkUpdateAppInputT,
  SdkUpdateAppOutputT,
} from './dto';

import { SDK_MAGIC_APP_NAME } from './helpers';

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
        phrase: SDK_MAGIC_APP_NAME,
        archived: false,
        offset: 0,
        limit: 1,
        sort: 'createdAt:desc',
      }),
      TE.map(({ items }) => items[0]),
      TE.chainW((item) => {
        if (!item) {
          return TE.left(new SdkRecordNotFoundError({ id: SDK_MAGIC_APP_NAME }));
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

  create = ({ logo, ...data }: SdkCreateAppInputT) =>
    this.fetch<SdkCreateAppOutputT, SdkRecordAlreadyExistsError | SdkInvalidFileFormatError>({
      url: this.endpoint('/'),
      options: pipe(
        jsonToFormData({
          logo,
          data: JSON.stringify(data),
        }),
        formDataPayload('POST'),
      ),
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

  update = ({ id, logo, ...data }: SdkUpdateAppInputT & SdkTableRowWithIdT) =>
    this.fetch<
      SdkUpdateAppOutputT,
      SdkRecordAlreadyExistsError | SdkRecordNotFoundError | SdkInvalidFileFormatError
    >({
      url: this.endpoint(`/${id}`),
      options: pipe(
        jsonToFormData({
          logo,
          data: JSON.stringify(data),
        }),
        formDataPayload('PUT'),
      ),
    });

  summarizeChatToApp = (chatId: SdkTableRowUuidT) =>
    this.fetch<SdkAppFromChatT, SdkRecordNotFoundError>({
      url: this.endpoint(`/summarize-chat-to-app/${chatId}`),
      options: getPayload(),
    });

  readonly commercial = {
    install: (dto: SdkInstallAgentsLibraryAgentInputT) =>
      this.fetch<
        SdkTableRowWithIdT,
        SdkRecordNotFoundError | SdkRecordAlreadyExistsError | SdkInvalidFileFormatError
      >({
        url: this.endpoint(`/commercial/install`),
        options: postPayload(dto),
      }),

    allInstalled: (dto: SdkSearchInstalledAppsMetadataInputT) =>
      this.fetch<SdkInstalledAppMetadataT[]>({
        url: this.endpoint(`/commercial/all-installed`),
        options: getPayload(),
        query: dto,
      }),
  };
};
