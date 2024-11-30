import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';

import type {
  SdkRecordAlreadyExistsError,
  SdkRecordNotFoundError,
  SdkTableRowUuidT,
  SdkTableRowWithUuidT,
} from '~/shared';

import { decodeTextAsyncStream } from '@llm/commons';
import { AbstractNestedSdkWithAuth } from '~/modules/abstract-nested-sdk-with-auth';
import {
  getPayload,
  patchPayload,
  postPayload,
} from '~/shared';

import type {
  SdkCreateMessageInputT,
  SdkRequestAIReplyInputT,
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
