import { MessageCirclePlusIcon, RepeatIcon } from 'lucide-react';

import type { CanBePromise } from '@llm/commons';
import type { SdkAppT } from '@llm/sdk';
import type { CardBigActionButtonProps } from '~/ui';

import { useI18n } from '~/i18n';
import { useSitemap } from '~/routes/use-sitemap';
import { CardBigActionButton, CardBigActions } from '~/ui';

type Props = {
  app: SdkAppT;
  onCreateChat?: () => CanBePromise<void>;
};

export function AppCardBigActions({ app, onCreateChat }: Props) {
  const sitemap = useSitemap();

  return (
    <CardBigActions>
      {app.recentChats.length > 0 && (
        <CardContinueChatButton href={sitemap.apps.recentChatOrFallback(app)} />
      )}

      <CardStartChatButton onClick={onCreateChat} />
    </CardBigActions>
  );
}

function CardStartChatButton({ disabled, loading, ...props }: Omit<CardBigActionButtonProps, 'children'>) {
  const t = useI18n().pack.apps.card;

  return (
    <CardBigActionButton
      icon={<MessageCirclePlusIcon size={18} />}
      disabled={disabled}
      loading={loading}
      variant="primary"
      {...props}
    >
      {t.startChat}
    </CardBigActionButton>
  );
}

function CardContinueChatButton({ disabled, loading, ...props }: Omit<CardBigActionButtonProps, 'children'>) {
  const t = useI18n().pack.apps.card;

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
