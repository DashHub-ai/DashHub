import { useI18n } from '~/i18n';
import { GhostPlaceholder } from '~/modules/shared';

export function ChatHistoryPlaceholder() {
  const t = useI18n().pack.chats.history;

  return (
    <GhostPlaceholder>{t.placeholder}</GhostPlaceholder>
  );
}
