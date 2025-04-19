import { useI18n } from '~/i18n';
import { GhostPlaceholder } from '~/modules/shared';

export function AIExternalAPIsPlaceholder() {
  const t = useI18n().pack.aiExternalAPIs.grid;

  return (
    <GhostPlaceholder>{t.placeholder}</GhostPlaceholder>
  );
}
