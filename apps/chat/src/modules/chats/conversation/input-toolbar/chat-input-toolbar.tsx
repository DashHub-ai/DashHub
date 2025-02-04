import type { KeyboardEventHandler, MouseEventHandler } from 'react';

import { type CanBePromise, suppressEvent, useControlStrict, useForm } from '@under-control/forms';
import clsx from 'clsx';
import { pipe } from 'fp-ts/function';
import { CircleStopIcon, PaperclipIcon, SendIcon } from 'lucide-react';

import { StrictBooleanV, tapTaskOption } from '@llm/commons';
import { useAfterMount, useLocalStorageObject } from '@llm/commons-front';
import { getSdkAppMentionInChat, type SdkCreateMessageInputT, type SdkTableRowWithIdNameT } from '@llm/sdk';
import { useI18n } from '~/i18n';
import { Checkbox } from '~/ui';

import type { SdkRepeatedMessageItemT } from '../messages';

import { FilesCardsControlledList, selectChatFile } from '../files';
import { ChatChooseAppButton } from './chat-choose-app-button';
import { ChatReplyMessage } from './chat-reply-message';
import { ChatSelectApp } from './chat-select-app';

export type ChatInputValue = Omit<SdkCreateMessageInputT, 'replyToMessage'>;

export type ChatInputToolbarProps = {
  apps: Array<SdkTableRowWithIdNameT>;

  expanded?: boolean;
  rounded?: boolean;

  replying: boolean;
  replyToMessage?: SdkRepeatedMessageItemT | null;

  disabled?: boolean;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  withAppSelector?: boolean;

  onSubmit: (message: ChatInputValue) => CanBePromise<any>;
  onSelectApp?: (app: SdkTableRowWithIdNameT) => void;

  onCancelSubmit: VoidFunction;
  onCancelReplyToMessage: VoidFunction;
};

export function ChatInputToolbar(
  {
    withAppSelector = true,
    expanded,
    rounded,
    disabled,
    replying,
    replyToMessage,
    inputRef,
    onSubmit,
    onCancelSubmit,
    onCancelReplyToMessage,
    onSelectApp,
    apps,
  }: ChatInputToolbarProps,
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
      files: [],
    },
    onSubmit: (newValue) => {
      setValue({
        value: {
          content: '',
          files: [],
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

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
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

  const onAttachFile = pipe(
    selectChatFile,
    tapTaskOption((file) => {
      setValue({
        value: {
          ...value,
          files: [...(value.files ?? []), file],
        },
      });
    }),
  );

  useAfterMount(() => {
    if (apps.length) {
      selectedApp.setValue({
        value: apps[0],
      });
    }
  });

  return (
    <form
      className={clsx(
        'mx-auto w-full max-w-full',
        !expanded && '2xl:w-9/12',
      )}
      onSubmit={handleSubmitEvent}
    >
      {replyToMessage && (
        <ChatReplyMessage
          message={replyToMessage}
          onClose={onCancelReplyToMessage}
        />
      )}

      <div
        className={clsx(
          'relative z-10 bg-background shadow-sm border-t border-border overflow-hidden',
          'focus-within:border-primary/50',
          'transition-border duration-100',
          rounded && 'rounded-lg border',
          !rounded && 'rounded-t-lg rounded-x-lg border-x border-t',
        )}
      >
        <div className="mb-[45px]">
          <textarea
            ref={inputRef as any}
            disabled={isTypingDisabled}
            className={clsx(
              'p-3 pb-0 w-full text-sm focus:outline-none resize-none',
              withAppSelector
                ? 'h-[60px]'
                : 'h-[45px]',
            )}
            placeholder={t.placeholders.enterMessage}
            required
            onKeyDown={handleKeyDown}
            {...bind.path('content')}
          />

          <FilesCardsControlledList
            {...bind.path('files')}
            className="mt-3 mb-2 px-3"
          />

          {withAppSelector && (
            <ChatSelectApp
              apps={apps}
              disabled={disabled}
              className="mt-1 px-3"
              {...selectedApp.bind.entire()}
            />
          )}
        </div>

        <div className="bottom-2 absolute flex flex-col gap-1 px-3 w-full">
          <div className="flex flex-row items-center gap-2 w-full">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className={clsx(
                  'inline-flex items-center gap-2 px-3 py-1 rounded-md font-medium text-xs',
                  'text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500',
                  'border border-gray-200',
                  disabled && 'opacity-50 cursor-not-allowed',
                )}
                onClick={onAttachFile}
              >
                <PaperclipIcon size={14} />
                <span>{t.actions.attachFile}</span>
              </button>

              {withAppSelector && (
                <ChatChooseAppButton
                  selectedApps={apps}
                  disabled={disabled}
                  onSelect={(app) => {
                    selectedApp.setValue({
                      value: app,
                    });
                    onSelectApp?.(app);
                  }}
                />
              )}
            </div>

            <Checkbox
              className="text-sm"
              disabled={disabled}
              value={!!submitOnEnterStorage.getOrNull()}
              onChange={submitOnEnterStorage.set}
            >
              {t.actions.submitOnEnter}
            </Checkbox>

            <div className="ml-auto">
              <button
                type="submit"
                disabled={disabled || (!replying && !value.content)}
                className={clsx(
                  'flex flex-row items-center px-3 py-1 rounded-lg h-8 text-sm text-white transition-colors uk-button uk-button-primary',
                  disabled
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gray-700 hover:bg-gray-800',
                )}
                {...replying && {
                  onClick: onClickCancelSubmit,
                }}
              >
                {replying ? <CircleStopIcon size={14} className="mr-1" /> : <SendIcon size={14} className="mr-1" />}
                {replying ? t.actions.cancel : t.actions.send}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
