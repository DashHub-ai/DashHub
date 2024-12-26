import { useI18n } from '~/i18n';
import { GhostPlaceholder } from '~/modules/shared';

export function ProjectFilesPlaceholder() {
  const t = useI18n().pack.projects.files;

  return (
    <GhostPlaceholder>{t.emptyPlaceholder}</GhostPlaceholder>
  );
}
