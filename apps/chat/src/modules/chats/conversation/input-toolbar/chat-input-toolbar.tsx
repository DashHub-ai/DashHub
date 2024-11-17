import { type CanBePromise, useForm } from '@under-control/forms';
import clsx from 'clsx';
import { MessageCircle, SendIcon } from 'lucide-react';

import type { SdkCreateMessageInputT } from '@llm/sdk';

import { StrictBooleanV } from '@llm/commons';
import { useLocalStorageObject } from '@llm/commons-front';
import { Checkbox } from '@llm/ui';
import { useI18n } from '~/i18n';

type Props = {
  inputRef?: React.RefObject<HTMLInputElement>;
  onSubmit: (message: SdkCreateMessageInputT) => CanBePromise<any>;
};

export function ChatInputToolbar({ inputRef, onSubmit }: Props) {
  const t = useI18n().pack.chat;

  const submitOnEnterStorage = useLocalStorageObject('chat-input-toolbar-submit-on-enter', {
    schema: StrictBooleanV.catch(true),
    readBeforeMount: true,
  });

  const { bind, value, handleSubmitEvent, submitState, submit, setValue } = useForm<SdkCreateMessageInputT>({
    defaultValue: {
      content: '',
    },
    onSubmit: (newValue) => {
      setValue({
        value: {
          content: '',
        },
      });

      return onSubmit(newValue);
    },
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (submitOnEnterStorage.getOrNull() && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      if (value.content.length) {
        void submit();
      }
    }
  };

  return (
    <form
      className="border-gray-200 bg-white p-4 border-t"
      onSubmit={handleSubmitEvent}
    >
      <div className="relative flex gap-2">
        <input
          type="text"
          ref={inputRef}
          disabled={submitState.loading}
          className="flex-1 border-gray-200 py-2 pr-4 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
          placeholder={t.placeholders.enterMessage}
          required
          onKeyDown={handleKeyDown}
          {...bind.path('content')}
        />

        <div className="top-1/2 left-4 absolute -translate-y-1/2">
          <MessageCircle size={18} className="text-gray-400" />
        </div>

        <button
          type="submit"
          className={clsx(
            'flex flex-row items-center px-6 py-2 rounded-lg text-white transition-colors',
            !value.content
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gray-700 hover:bg-gray-800',
          )}
          disabled={!value.content || submitState.loading}
        >
          <SendIcon size={16} className="mr-2" />
          {t.actions.send}
        </button>
      </div>

      <div className="flex items-center gap-2 mt-3 text-gray-500 text-sm">
        <Checkbox
          value={!!submitOnEnterStorage.getOrNull()}
          onChange={submitOnEnterStorage.set}
        >
          {t.actions.submitOnEnter}
        </Checkbox>
      </div>
    </form>
  );
}
