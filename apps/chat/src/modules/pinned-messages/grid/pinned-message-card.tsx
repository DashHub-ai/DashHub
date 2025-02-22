import { LinkIcon } from 'lucide-react';
import { useLocation } from 'wouter';

import type { SdkSearchPinnedMessageItemT } from '@llm/sdk';

import { useI18n } from '~/i18n';
import { ChatMessage } from '~/modules/chats';
import { ToolbarSmallActionButton } from '~/modules/chats/conversation/messages/buttons';
import { useSitemap } from '~/routes/use-sitemap';

type Props = {
  pinnedMessage: SdkSearchPinnedMessageItemT;
};

export function PinnedMessageCard({ pinnedMessage }: Props) {
  const { message } = pinnedMessage;

  const sitemap = useSitemap();
  const t = useI18n().pack.pinnedMessages.buttons;
  const [, navigate] = useLocation();

  const onNavigate = () => {
    const link = sitemap.chat.generate({ pathParams: { id: message.chat.id } });

    navigate(link);
  };

  return (
    <ChatMessage
      className="mx-auto mb-0 max-w-[750px]"
      message={{ ...message, repeats: [] }}
      showToolbars={false}
      showAnim={false}
      actionsToolbar={(
        <ToolbarSmallActionButton
          title={t.goToChat}
          icon={<LinkIcon size={14} className="text-gray-500" />}
          onClick={onNavigate}
        />
      )}
    />
  );
}
