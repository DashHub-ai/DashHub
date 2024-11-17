import { useForm } from '@under-control/forms';
import { pipe } from 'fp-ts/lib/function';
import { MessageCircle, SendIcon } from 'lucide-react';

import { runTaskAsVoid, StrictBooleanV, tryOrThrowTE } from '@llm/commons';
import { useLocalStorageObject } from '@llm/commons-front';
import { type SdkChatT, type SdkCreateMessageInputT, useSdk } from '@llm/sdk';
import { Checkbox } from '@llm/ui';
import { useI18n } from '~/i18n';

type Props = {
  chat: SdkChatT;
};

export function ChatInputToolbar({ chat }: Props) {
  const t = useI18n().pack.chat;
  const { sdks } = useSdk();
  const submitOnEnterStorage = useLocalStorageObject('chat-input-toolbar-submit-on-enter', {
    schema: StrictBooleanV.catch(true),
    readBeforeMount: true,
  });

  const { bind, value, handleSubmitEvent, submit } = useForm<SdkCreateMessageInputT>({
    resetAfterSubmit: true,
    defaultValue: {
      content: '',
    },
    onSubmit: value => pipe(
      sdks.dashboard.chats.createMessage(chat.id, value),
      tryOrThrowTE,
      runTaskAsVoid,
    ),
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (submitOnEnterStorage.getOrNull() && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void submit();
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
          className="flex flex-row items-center bg-gray-700 hover:bg-gray-800 px-6 py-2 rounded-lg text-white transition-colors"
          disabled={!value.content}
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
