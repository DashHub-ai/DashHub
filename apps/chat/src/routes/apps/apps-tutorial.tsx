import { useI18n } from '~/i18n';
import { TutorialBox } from '~/ui';

export function AppsTutorial() {
  const t = useI18n().pack.routes.apps.tutorial;

  return (
    <TutorialBox title={t.title} icon="?" id="apps-tutorial">
      <p className="flex items-start gap-2">
        <span className="text-amber-500">🛠️</span>
        <span>{t.tools}</span>
      </p>
      <p className="flex items-start gap-2">
        <span className="text-amber-500">🧩</span>
        <span>{t.modular}</span>
      </p>
    </TutorialBox>
  );
}
