import { RepeatIcon } from 'lucide-react';

import type { SdkSearchChatItemT } from '@llm/sdk';
import type { CardBigActionButtonProps } from '~/ui';

import { useI18n } from '~/i18n';
import { useSitemap } from '~/routes/use-sitemap';
import { CardBigActionButton, CardBigActions } from '~/ui';

type Props = {
  chat: SdkSearchChatItemT;
};

export function ChatCardBigActions({ chat }: Props) {
  const sitemap = useSitemap();

  return (
    <CardBigActions>
      <CardContinueChatButton href={sitemap.chat.generate({ pathParams: { id: chat.id } })} />
    </CardBigActions>
  );
}

function CardContinueChatButton({ disabled, loading, ...props }: Omit<CardBigActionButtonProps, 'children'>) {
  const t = useI18n().pack.chat.card;

  return (
    <CardBigActionButton
      icon={<RepeatIcon size={18} />}
      disabled={disabled}
      loading={loading}
      variant="secondary"
      {...props}
    >
      {t.continueChat}
    </CardBigActionButton>
  );
}
