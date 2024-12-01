import type { KeyboardEventHandler, MouseEventHandler } from 'react';

import { type CanBePromise, suppressEvent, useControlStrict, useForm } from '@under-control/forms';
import clsx from 'clsx';
import { CircleStopIcon, MessageCircle, SendIcon } from 'lucide-react';

import { StrictBooleanV } from '@llm/commons';
import { useAfterMount, useLocalStorageObject } from '@llm/commons-front';
import { getSdkAppMentionInChat, type SdkCreateMessageInputT, type SdkTableRowWithIdNameT } from '@llm/sdk';
import { Checkbox } from '@llm/ui';
import { useI18n } from '~/i18n';

import type { SdkRepeatedMessageItemT } from '../messages';

import { ChatReplyMessage } from './chat-reply-message';
import { ChatSelectApp } from './chat-select-app';

export type ChatInputValue = Omit<SdkCreateMessageInputT, 'replyToMessage'>;

type Props = {
  apps: Array<SdkTableRowWithIdNameT>;

  replying: boolean;
  replyToMessage?: SdkRepeatedMessageItemT | null;

  disabled?: boolean;
  inputRef?: React.RefObject<HTMLInputElement>;

  onSubmit: (message: ChatInputValue) => CanBePromise<any>;
  onCancelSubmit: VoidFunction;
  onCancelReplyToMessage: VoidFunction;
};

export function ChatInputToolbar(
  {
    disabled,
    replying,
    replyToMessage,
    inputRef,
    onSubmit,
    onCancelSubmit,
    onCancelReplyToMessage,
    apps,
  }: Props,
) {
  const t = useI18n().pack.chat;

  const submitOnEnterStorage = useLocalStorageObject('chat-input-toolbar-submit-on-enter', {
    forceParseIfNotSet: true,
    schema: StrictBooleanV.catch(true),
    readBeforeMount: true,
  });

  const selectedApp = useControlStrict<SdkTableRowWithIdNameT | null>({
    defaultValue: null,
  });

  const {
    bind,
    value,
    handleSubmitEvent,
    submit,
    setValue,
  } = useForm<ChatInputValue>({
    defaultValue: {
      content: '',
    },
    onSubmit: (newValue) => {
      setValue({
        value: {
          content: '',
        },
      });

      let mappedContent = newValue.content.trim();

      if (selectedApp.value) {
        mappedContent = `${getSdkAppMentionInChat(selectedApp.value)} ${mappedContent}`;
      }

      return onSubmit({
        ...newValue,
        content: mappedContent,
      });
    },
  });

  const isTypingDisabled = disabled || replying;

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (submitOnEnterStorage.getOrNull() && event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();

      if (value.content.length) {
        void submit();
      }
    }
  };

  const onClickCancelSubmit: MouseEventHandler<HTMLButtonElement> = (evt) => {
    suppressEvent(evt);
    onCancelSubmit?.();
  };

  useAfterMount(() => {
    if (apps.length) {
      selectedApp.setValue({
        value: apps[0],
      });
    }
  });

  return (
    <form
      className="border-gray-200 bg-white p-4 border-t"
      onSubmit={handleSubmitEvent}
    >
      {replyToMessage && (
        <ChatReplyMessage
          message={replyToMessage}
          onClose={onCancelReplyToMessage}
        />
      )}

      <div className="relative gap-2 grid grid-cols-[1fr,auto]">
        <div className="relative">
          <input
            type="text"
            ref={inputRef}
            disabled={isTypingDisabled}
            className={clsx(
              'border-gray-200 py-2 pr-4 pl-10 border rounded-lg focus:ring-2 focus:ring-gray-500 w-full focus:outline-none',
              isTypingDisabled && 'bg-gray-100 cursor-not-allowed',
            )}
            placeholder={t.placeholders.enterMessage}
            required
            onKeyDown={handleKeyDown}
            {...bind.path('content')}
          />

          <div className="top-1/2 left-4 absolute -translate-y-1/2">
            <MessageCircle size={18} className="text-gray-400" />
          </div>
        </div>

        <button
          type="submit"
          disabled={disabled}
          className={clsx(
            'flex flex-row items-center px-4 py-2 rounded-lg h-full text-white transition-colors uk-button uk-button-primary',
            disabled
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gray-700 hover:bg-gray-800',
          )}
          {...replying && {
            onClick: onClickCancelSubmit,
          }}
        >
          {(
            replying
              ? <CircleStopIcon size={16} />
              : <SendIcon size={16} />
          )}
        </button>
      </div>

      <div className="flex flex-row items-center gap-6 mt-2">
        <Checkbox
          value={!!submitOnEnterStorage.getOrNull()}
          onChange={submitOnEnterStorage.set}
        >
          {t.actions.submitOnEnter}
        </Checkbox>

        <ChatSelectApp
          apps={apps}
          disabled={disabled}
          {...selectedApp.bind.entire()}
        />
      </div>
    </form>
  );
}
