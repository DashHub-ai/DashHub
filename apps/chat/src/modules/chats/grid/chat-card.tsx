import { ArchiveIcon, ExternalLinkIcon, MessageSquareTextIcon } from 'lucide-react';
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
        <MessageSquareTextIcon size={16} className="flex-shrink-0 text-gray-500" />
        <h3 className="font-medium text-gray-900 truncate">
          {chat.summary?.name?.value ?? 'Unnamed Chat'}
        </h3>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <time className="text-gray-500 text-xs">
            {formatDate(chat.createdAt)}
          </time>

          {chat.archived && (
            <span
              className="inline-flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded text-gray-600 text-xs"
              title={t.chat.archived}
            >
              <ArchiveIcon size={12} />
              {t.chat.archived}
            </span>
          )}
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
