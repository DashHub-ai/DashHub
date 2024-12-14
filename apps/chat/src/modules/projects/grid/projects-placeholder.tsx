import { useI18n } from '~/i18n';
import { GhostPlaceholder } from '~/modules/shared';

export function ProjectsPlaceholder() {
  const t = useI18n().pack.projects.grid;

  return (
    <GhostPlaceholder>{t.placeholder}</GhostPlaceholder>
  );
}
