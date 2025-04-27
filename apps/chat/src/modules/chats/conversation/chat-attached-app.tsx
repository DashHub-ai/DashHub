import { ArrowRight, Send, Sparkles, Wand2 } from 'lucide-react';
import { memo } from 'react';
import { Link } from 'wouter';

import { getSdkAppMentionInChat, type SdkTableRowWithIdNameT, useSdkForLoggedIn } from '@llm/sdk';
import { useI18n } from '~/i18n';
import { useCachedAppLookup } from '~/modules/apps/use-cached-app-lookup';
import { useSitemap } from '~/routes/use-sitemap';

import type { ChatInputValue } from './input-toolbar';

type ChatAttachedAppProps = {
  app: SdkTableRowWithIdNameT;
  showPrompts?: boolean;
  onSendChatMessage: (message: ChatInputValue) => void;
};

export const ChatAttachedApp = memo(({ app, showPrompts, onSendChatMessage }: ChatAttachedAppProps) => {
  const appData = useCachedAppLookup(app.id);
  const sitemap = useSitemap();
  const { pack } = useI18n();
  const { guard } = useSdkForLoggedIn();

  if (appData.status !== 'success') {
    return null;
  }

  const { data } = appData;

  const onSendAppMessage = (content: string) => {
    onSendChatMessage({
      content: `${getSdkAppMentionInChat(app)} ${content}`,
      webSearch: false,
    });
  };

  return (
    <div className="opacity-0 mb-5 animate-messageSlideIn">
      <div className="flex flex-col items-center space-y-4 p-4 rounded-lg">
        {data.logo
          ? (
              <img src={data.logo.publicUrl} alt={data.name} className="border border-gray-100 rounded-2xl w-16 h-16 object-contain" />
            )
          : (
              <div className="flex justify-center items-center bg-gradient-to-br from-[#f2b535]/20 to-[#f2b535]/5 shadow-sm border border-[#f2b535]/15 rounded-2xl w-16 h-16">
                <Sparkles className="w-10 h-10 text-[#f2b535]" />
              </div>
            )}

        <div className="space-y-3 text-center">
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900">{data.name}</h3>
            <div className="inline-flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full text-gray-600 text-xs">
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
                className="group flex items-center gap-2 bg-white hover:bg-gray-100 px-4 py-3 border border-gray-200 rounded-lg text-gray-700 text-sm hover:scale-[1.01] transition-all duration-150 ease-in-out"
                onClick={() => onSendAppMessage(prompt)}
              >
                <span className="flex-1 text-left">{prompt}</span>
                <Send size={14} className="text-gray-400 group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>
        )}

        {guard.is.minimum.techUser && (
          <Link
            to={sitemap.apps.update.generate({ pathParams: { id: app.id } })}
            className="inline-flex items-center gap-1 text-primary hover:text-primary-dark text-sm underline transition-colors"
          >
            {pack.buttons.edit}
            <ArrowRight size={14} />
          </Link>
        )}
      </div>
    </div>
  );
});
