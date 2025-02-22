import { useI18n } from '~/i18n';
import { GhostPlaceholder } from '~/modules/shared';

export function PinnedMessagesPlaceholder() {
  const t = useI18n().pack.pinnedMessages.grid;

  return (
    <GhostPlaceholder>{t.placeholder}</GhostPlaceholder>
  );
}
