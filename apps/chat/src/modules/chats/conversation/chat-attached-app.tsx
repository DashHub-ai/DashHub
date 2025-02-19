import { Bot, Send, Wand2 } from 'lucide-react';
import { memo } from 'react';

import { getSdkAppMentionInChat, type SdkTableRowWithIdNameT } from '@llm/sdk';
import { useI18n } from '~/i18n';
import { useCachedAppLookup } from '~/modules/apps/use-cached-app-lookup';

import type { ChatInputValue } from './input-toolbar';

type ChatAttachedAppProps = {
  app: SdkTableRowWithIdNameT;
  showPrompts?: boolean;
  onSendChatMessage: (message: ChatInputValue) => void;
};

export const ChatAttachedApp = memo(({ app, showPrompts, onSendChatMessage }: ChatAttachedAppProps) => {
  const appData = useCachedAppLookup(app.id);
  const { pack } = useI18n();

  if (appData.status !== 'success') {
    return null;
  }

  const { data } = appData;

  const onSendAppMessage = (content: string) => {
    onSendChatMessage({
      content: `${getSdkAppMentionInChat(app)} ${content}`,
    });
  };

  return (
    <div className="opacity-0 mb-5 animate-messageSlideIn">
      <div className="flex flex-col items-center space-y-6 p-4 rounded-lg">
        {data.logo
          ? (
              <img src={data.logo.publicUrl} alt={data.name} className="rounded-2xl w-16 h-16 object-contain" />
            )
          : (
              <Bot className="rounded-2xl w-16 h-16 text-gray-400" />
            )}

        <div className="space-y-3 text-center">
          <div className="space-y-1">
            <h3 className="font-medium text-gray-900">{data.name}</h3>
            <div className="inline-flex items-center gap-1 bg-blue-100 px-2 py-0.5 rounded-full text-blue-700 text-xs">
              <Wand2 size={12} />
              <span>
                {pack.chat.app.attached}
              </span>
            </div>
          </div>

          {data.description && (
            <p className="max-w-md text-gray-600 text-sm">{data.description}</p>
          )}
        </div>

        {showPrompts && (
          <div className="flex flex-col gap-2 w-full max-w-md">
            {pack.prompts.attachApp.map(prompt => (
              <button
                key={prompt}
                type="button"
                className="group flex items-center gap-2 bg-white shadow-sm hover:shadow px-4 py-3 border border-gray-200 rounded-lg text-gray-700 text-sm hover:scale-[1.01] transition-all"
                onClick={() => onSendAppMessage(prompt)}
              >
                <span className="flex-1">{prompt}</span>
                <Send size={14} className="group-hover:text-blue-500 text-gray-400 transition-colors" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});
