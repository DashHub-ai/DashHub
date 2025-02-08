import { ArchiveIcon, FolderIcon, Loader2Icon, MessageSquareIcon } from 'lucide-react';
import { Link } from 'wouter';

import { formatDate } from '@llm/commons';
import { isSdkAIGeneratingString, type SdkSearchChatItemT } from '@llm/sdk';
import { useI18n } from '~/i18n';
import { CardRecordPermissionsRow } from '~/modules/permissions/card';
import { useSitemap } from '~/routes';
import { CardBase, CardContent, CardDescription, CardFooter, CardTitle } from '~/ui';

export type ChatCardProps = {
  chat: SdkSearchChatItemT;
  withProject?: boolean;
  withPermissions?: boolean;
};

export function ChatCard({ chat, withProject = true, withPermissions = true }: ChatCardProps) {
  const t = useI18n().pack;
  const sitemap = useSitemap();
  const { summary } = chat;

  const totalMessages = chat.stats.messages.total;

  const isGeneratingDescription = !!totalMessages && isSdkAIGeneratingString(summary.content);
  const isGeneratingTitle = !!totalMessages && isSdkAIGeneratingString(summary.name);

  return (
    <CardBase
      href={sitemap.chat.generate({
        pathParams: { id: chat.id },
      })}
    >
      <CardTitle
        icon={(
          isGeneratingTitle
            ? <Loader2Icon size={14} className="animate-spin" />
            : <MessageSquareIcon size={16} />
        )}
      >
        {(
          isGeneratingTitle
            ? t.chat.generating.title
            : summary.name?.value ?? t.chat.card.noTitle
        )}
      </CardTitle>

      <CardContent>
        {isGeneratingDescription
          ? (
              <div className="flex flex-1 justify-center items-center gap-2 text-gray-500 text-sm">
                <Loader2Icon size={14} className="animate-spin" />
                {t.chat.generating.description}
              </div>
            )
          : (
              <CardDescription>
                {summary.content.value ?? t.chat.card.noDescription}
              </CardDescription>
            )}

        {withProject && chat.project && !chat.project.internal && (
          <div className="flex items-center gap-1 my-2 text-sm">
            <FolderIcon size={14} className="text-gray-500" />
            <Link
              href={sitemap.projects.show.generate({ pathParams: { id: chat.project.id } })}
              className="text-gray-900 hover:underline"
            >
              {chat.project.name}
            </Link>
          </div>
        )}

        <div className="flex items-center gap-1 text-gray-500 text-sm">
          <MessageSquareIcon size={14} />
          <span>
            {totalMessages}
            {' '}
            {t.chat.card.totalMessages}
          </span>
        </div>

        <CardFooter>
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

          {withPermissions && <CardRecordPermissionsRow record={chat} />}
        </CardFooter>
      </CardContent>
    </CardBase>
  );
}
