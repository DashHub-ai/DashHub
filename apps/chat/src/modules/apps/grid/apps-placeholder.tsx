import { useI18n } from '~/i18n';
import { GhostPlaceholder } from '~/modules/shared';

export function AppsPlaceholder() {
  const t = useI18n().pack.apps.grid;

  return (
    <GhostPlaceholder>{t.placeholder}</GhostPlaceholder>
  );
}
