import { useForm } from '@under-control/forms';
import { MessageCircle, SendIcon } from 'lucide-react';

import { type SdkChatT, type SdkCreateMessageInputT, useSdk } from '@llm/sdk';
import { useI18n } from '~/i18n';

type Props = {
  chat: SdkChatT;
};

export function ChatInputToolbar({ chat }: Props) {
  const t = useI18n().pack.chat;
  const { sdks } = useSdk();

  const { bind, value, handleSubmitEvent } = useForm<SdkCreateMessageInputT>({
    resetAfterSubmit: true,
    defaultValue: {
      content: '',
    },
    onSubmit: (value) => {
      // eslint-disable-next-line no-console
      console.info('submit!', value, chat, sdks);
    },
  });

  return (
    <form
      className="relative border-gray-200 bg-white p-4 border-t"
      onSubmit={handleSubmitEvent}
    >
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border-gray-200 py-2 pr-4 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
          placeholder={t.placeholders.enterMessage}
          required
          {...bind.path('content')}
        />

        <div className="top-1/2 left-7 absolute -translate-y-1/2">
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
    </form>
  );
}
