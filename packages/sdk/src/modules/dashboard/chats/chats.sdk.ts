import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';

import type {
  SdkInvalidFileFormatError,
  SdkRecordAlreadyExistsError,
  SdkRecordNotFoundError,
  SdkTableRowUuidT,
  SdkTableRowWithUuidT,
} from '~/shared';

import { decodeTextAsyncStream } from '@dashhub/commons';
import { AbstractNestedSdkWithAuth } from '~/modules/abstract-nested-sdk-with-auth';
import {
  formDataPayload,
  getPayload,
  jsonToFormData,
  patchPayload,
  postPayload,
  putPayload,
} from '~/shared';

import type {
  SdkAttachAppInputT,
  SdkCreateMessageInputT,
  SdkRequestAIReplyInputT,
  SdkSearchMessagesInputT,
  SdkSearchMessagesOutputT,
} from '../messages';
import type {
  SdkChatT,
  SdkCreateChatInputT,
  SdkCreateChatOutputT,
  SdkSearchChatsInputT,
  SdkSearchChatsOutputT,
  SdkUpdateChatInputT,
  SdkUpdateChatOutputT,
} from './dto';

type AIRequestReplyAttrs = {
  chatId: SdkTableRowUuidT;
  messageId: SdkTableRowUuidT;
  data: SdkRequestAIReplyInputT;
  abortController: AbortController;
};

export class ChatsSdk extends AbstractNestedSdkWithAuth {
  protected endpointPrefix = '/dashboard/chats';

  get = (id: SdkTableRowUuidT) =>
    this.fetch<SdkChatT>({
      url: this.endpoint(`/${id}`),
      options: getPayload(),
    });

  search = (data: SdkSearchChatsInputT) =>
    this.fetch<SdkSearchChatsOutputT>({
      url: this.endpoint('/search'),
      query: data,
      options: getPayload(),
    });

  create = (data: SdkCreateChatInputT) =>
    this.fetch<SdkCreateChatOutputT>({
      url: this.endpoint('/'),
      options: postPayload(data),
    });

  update = ({ id, ...data }: SdkUpdateChatInputT & SdkTableRowWithUuidT) =>
    this.fetch<
      SdkUpdateChatOutputT,
      SdkRecordAlreadyExistsError | SdkRecordNotFoundError
    >({
      url: this.endpoint(`/${id}`),
      options: putPayload(data),
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
    data: Omit<SdkSearchMessagesInputT, 'chatIds'>,
  ) =>
    this.fetch<SdkSearchMessagesOutputT>({
      url: this.endpoint(`/${chatId}/messages`),
      query: data,
      options: getPayload(),
    });

  createMessage = (chatId: SdkTableRowUuidT, data: SdkCreateMessageInputT) =>
    this.fetch<SdkTableRowWithUuidT, SdkInvalidFileFormatError>({
      url: this.endpoint(`/${chatId}/messages`),
      options: pipe(
        jsonToFormData({
          ...data,
          files: data.files ?? [],
        }),
        formDataPayload('POST'),
      ),
    });

  attachApp = (chatId: SdkTableRowUuidT, data: SdkAttachAppInputT) =>
    this.fetch<SdkTableRowWithUuidT>({
      url: this.endpoint(`/${chatId}/messages/attach-app`),
      options: postPayload(data),
    });

  requestAIReply = (
    {
      abortController,
      chatId,
      messageId,
      data,
    }: AIRequestReplyAttrs,
  ) =>
    pipe(
      this.fetch<AsyncGenerator<Uint8Array>>({
        url: this.endpoint(`/${chatId}/messages/${messageId}/ai-reply`),
        options: postPayload(data),
        stream: true,
        abortController,
      }),
      TE.map(decodeTextAsyncStream),
    );
};
