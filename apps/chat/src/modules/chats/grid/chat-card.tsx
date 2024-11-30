import { clsx } from 'clsx';
import { ArchiveIcon, ChevronDownIcon, ChevronUpIcon, ExternalLinkIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const contentRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const lineHeight = Number.parseInt(getComputedStyle(contentRef.current).lineHeight, 10);
      const height = contentRef.current.scrollHeight;
      setHasOverflow(height > lineHeight * 2);
    }
  }, [chat.summary?.content?.value]);

  return (
    <div className="flex flex-col bg-white shadow-sm hover:shadow-md p-4 pb-2 border border-border/50 rounded-lg transition-shadow">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="font-medium text-gray-900 truncate">
          {chat.summary?.name?.value ?? 'Unnamed Chat'}
        </h3>
      </div>

      {chat.summary?.content?.value && (
        <div className="flex-1 mb-3">
          <p
            ref={contentRef}
            className={clsx('text-gray-500 text-sm', !isExpanded && 'line-clamp-2')}
          >
            {chat.summary.content.value}
          </p>

          {hasOverflow && (
            <button
              type="button"
              onClick={() => setIsExpanded(prev => !prev)}
              className="flex items-center gap-1 hover:bg-gray-100 mt-1 -ml-2 px-2 py-0.5 rounded text-gray-900 text-xs"
            >
              {isExpanded
                ? (
                    <>
                      {t.chat.actions.expand.less}
                      <ChevronUpIcon size={14} />
                    </>
                  )
                : (
                    <>
                      {t.chat.actions.expand.more}
                      <ChevronDownIcon size={14} />
                    </>
                  )}
            </button>
          )}
        </div>
      )}

      <div className="flex justify-between items-center mt-auto">
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
