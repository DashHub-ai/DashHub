import { TutorialBox } from '@llm/ui';
import { useI18n } from '~/i18n';

export function ExpertsTutorial() {
  const t = useI18n().pack.routes.experts.tutorial;

  return (
    <TutorialBox title={t.title} icon="🧠" id="experts-tutorial">
      <p className="flex items-start gap-2">
        <span className="text-amber-500">🤖</span>
        <span>{t.custom}</span>
      </p>
      <p className="flex items-start gap-2">
        <span className="text-amber-500">🏢</span>
        <span>{t.organization}</span>
      </p>
      <p className="flex items-start gap-2">
        <span className="text-amber-500">📚</span>
        <span>{t.knowledge}</span>
      </p>
    </TutorialBox>
  );
}
