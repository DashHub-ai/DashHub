import { TutorialBox } from '~/components';
import { useI18n } from '~/i18n';

export function ProjectsTutorial() {
  const t = useI18n().pack.routes.projects.tutorial;

  return (
    <TutorialBox title={t.title} icon="?" id="projects-tutorial">
      <p className="flex items-start gap-2">
        <span className="text-amber-500">📂</span>
        <span>{t.spaces}</span>
      </p>
      <p className="flex items-start gap-2">
        <span className="text-amber-500">👥</span>
        <span>{t.collaboration}</span>
      </p>
      <p className="flex items-start gap-2">
        <span className="text-amber-500">💾</span>
        <span>{t.context}</span>
      </p>
    </TutorialBox>
  );
}
