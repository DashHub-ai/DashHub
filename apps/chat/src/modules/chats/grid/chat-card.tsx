import { ArchiveIcon, FolderIcon, Loader2Icon, MessageSquareIcon } from 'lucide-react';
import { Link } from 'wouter';

import { formatDate } from '@llm/commons';
import { isSdkAIGeneratingString, type SdkSearchChatItemT } from '@llm/sdk';
import { CardBase, CardContent, CardDescription, CardFooter, CardTitle } from '@llm/ui';
import { useI18n } from '~/i18n';
import { CardRecordPermissionsRows } from '~/modules/permissions/card';
import { useSitemap } from '~/routes';

type ChatCardProps = {
  chat: SdkSearchChatItemT;
  withProject?: boolean;
};

export function ChatCard({ chat, withProject = true }: ChatCardProps) {
  const t = useI18n().pack;
  const sitemap = useSitemap();
  const { summary } = chat;
  const isGeneratingTitle = isSdkAIGeneratingString(summary.name);

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
            : summary.name?.value ?? 'Unnamed Chat'
        )}
      </CardTitle>

      <CardContent>
        {isSdkAIGeneratingString(summary.content)
          ? (
              <div className="flex flex-1 justify-center items-center gap-2 text-gray-500 text-sm">
                <Loader2Icon size={14} className="animate-spin" />
                {t.chat.generating.description}
              </div>
            )
          : summary.content?.value && (
            <CardDescription>
              {summary.content.value}
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

        <CardRecordPermissionsRows record={chat} />

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
        </CardFooter>
      </CardContent>
    </CardBase>
  );
}
