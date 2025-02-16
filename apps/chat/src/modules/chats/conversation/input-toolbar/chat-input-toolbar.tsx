import type { KeyboardEventHandler, MouseEventHandler } from 'react';

import { type CanBePromise, suppressEvent, useControlStrict, useForm } from '@under-control/forms';
import clsx from 'clsx';
import { pipe } from 'fp-ts/function';
import { CircleStopIcon, PaperclipIcon, SendIcon } from 'lucide-react';

import { StrictBooleanV, tapTaskOption } from '@llm/commons';
import { useAfterMount, useLocalStorageObject, useUpdateEffect } from '@llm/commons-front';
import { getSdkAppMentionInChat, type SdkCreateMessageInputT, type SdkTableRowWithIdNameT } from '@llm/sdk';
import { useI18n } from '~/i18n';
import { Checkbox } from '~/ui';

import type { SdkRepeatedMessageItemT } from '../messages';

import { FilesCardsControlledList, selectChatFile } from '../files';
import { ChatChooseAppButton } from './chat-choose-app-button';
import { ChatReplyMessage } from './chat-reply-message';
import { ChatSelectApp } from './chat-select-app';
import { ChatWebSearchButton } from './chat-web-search-button';

export type ChatInputValue = Omit<SdkCreateMessageInputT, 'replyToMessage'>;

export type ChatInputToolbarProps = {
  defaultValue?: Partial<ChatInputValue>;

  apps: Array<SdkTableRowWithIdNameT>;

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
    defaultValue,
    withAppSelector = true,
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
    resetAfterSubmit: false,
    defaultValue: {
      content: '',
      files: [],
      ...defaultValue,
    },
    onSubmit: (newValue) => {
      setValue({
        // Keeps webSearch value
        merge: true,
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

  useUpdateEffect(() => {
    setValue({
      value: {
        ...value,
        webSearch: !!defaultValue?.webSearch,
      },
    });
  }, [!!defaultValue?.webSearch]);

  return (
    <form
      className={clsx(
        'flex flex-col m-auto w-full min-w-0 max-w-[800px]',
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
          'z-10 relative bg-white rounded-2xl',
          'border border-gray-200',
          'focus-within:border-gray-300',
          'shadow-[0_2px_8px_rgba(0,0,0,0.04)]',
          'transition-all duration-200',
        )}
      >
        <div className="mb-[53px]">
          <textarea
            ref={inputRef as any}
            disabled={isTypingDisabled}
            className={clsx(
              'rounded-2xl w-full resize-none',
              'focus:outline-none',
              'text-gray-700 placeholder:text-gray-400',
              value.files?.length
                ? 'p-4 pb-2 min-h-[20px]'
                : 'p-4 min-h-[80px]',
            )}
            placeholder={t.placeholders.enterMessage}
            required
            onKeyDown={handleKeyDown}
            {...bind.path('content')}
          />

          <FilesCardsControlledList
            {...bind.path('files')}
            className="px-4 pb-2"
          />

          {withAppSelector && (
            <ChatSelectApp
              apps={apps}
              disabled={disabled}
              className="px-4 pb-2"
              {...selectedApp.bind.entire()}
            />
          )}
        </div>

        <div
          className={clsx(
            'right-0 bottom-0 left-0 absolute',
            'px-3 py-2',
            'border-t border-gray-100',
            'bg-gray-50',
            'rounded-b-2xl',
            'flex items-center justify-between gap-4',
          )}
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              className={clsx(
                'hover:bg-gray-100 p-2 rounded-lg',
                'text-gray-500 hover:text-gray-700',
                'transition-colors duration-200',
                (disabled || replying) && 'opacity-50 cursor-not-allowed',
              )}
              onClick={onAttachFile}
              disabled={disabled}
            >
              <PaperclipIcon size={20} />
            </button>

            <ChatWebSearchButton
              disabled={disabled || replying}
              {...bind.path('webSearch')}
            />

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

          <div className="flex items-center gap-4">
            <Checkbox
              className="flex items-center text-gray-600 text-sm"
              checkboxClassName="mt-[1px]"
              disabled={disabled}
              value={!!submitOnEnterStorage.getOrNull()}
              onChange={submitOnEnterStorage.set}
            >
              {t.actions.submitOnEnter}
            </Checkbox>

            <button
              type="submit"
              disabled={disabled || (!replying && !value.content)}
              className={clsx(
                'px-4 py-2 rounded-lg',
                'bg-gray-900 hover:bg-black',
                'text-white text-sm',
                'transition-colors duration-200',
                'flex items-center gap-2',
                'disabled:opacity-50',
              )}
              {...replying && {
                onClick: onClickCancelSubmit,
              }}
            >
              {replying ? <CircleStopIcon size={18} /> : <SendIcon size={18} />}
              <span>{replying ? t.actions.cancel : t.actions.send}</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
