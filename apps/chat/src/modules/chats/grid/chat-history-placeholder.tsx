import { useI18n } from '~/i18n';
import { GhostPlaceholder } from '~/modules/shared';

type Props = {
  className?: string;
};

export function ChatHistoryPlaceholder({ className }: Props) {
  const t = useI18n().pack.chats.history;

  return (
    <GhostPlaceholder className={className}>
      {t.placeholder}
    </GhostPlaceholder>
  );
}
