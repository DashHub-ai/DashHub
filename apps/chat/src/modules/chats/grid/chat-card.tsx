import { ExternalLinkIcon, MessageSquareTextIcon } from 'lucide-react';
import { Link } from 'wouter';

import type { SdkSearchChatItemT } from '@llm/sdk';

import { formatDate } from '@llm/commons';
import { useI18n } from '~/i18n';
import { useSitemap } from '~/routes';

type ChatCardProps = {
  chat: SdkSearchChatItemT;
};

export function ChatCard({ chat }: ChatCardProps) {
  const t = useI18n().pack;
  const sitemap = useSitemap();

  return (
    <div className="flex flex-col bg-white shadow-sm hover:shadow-md p-4 pb-2 border border-border/50 rounded-lg transition-shadow">
      <div className="flex items-center gap-2 mb-2">
        <div className="text-muted-foreground">
          <MessageSquareTextIcon size={16} />
        </div>

        <h3 className="font-medium">
          {chat.summary?.name?.value ?? 'Unnamed Chat'}
        </h3>
      </div>

      <div className="flex flex-row justify-between items-center">
        <div className="text-muted-foreground text-xs">
          {formatDate(chat.createdAt)}
        </div>

        <Link
          href={sitemap.chat.generate({ pathParams: { id: chat.id } })}
          className="uk-button uk-button-secondary uk-button-small"
        >
          <ExternalLinkIcon size={16} className="mr-2" />
          {t.buttons.open}
        </Link>
      </div>
    </div>
  );
}
