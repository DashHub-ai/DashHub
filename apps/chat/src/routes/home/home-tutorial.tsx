import { TutorialBox } from '~/components';
import { useI18n } from '~/i18n';

type Props = {
  className?: string;
};

export function HomeTutorial({ className }: Props) {
  const t = useI18n().pack.routes.home.tutorial;

  return (
    <TutorialBox
      variant="blue"
      title={t.title}
      backgroundIcon="💬"
      className={className}
      id="home-tutorial"
    >
      <p className="flex items-start gap-2">
        <span className="text-blue-500">🤖</span>
        <span>{t.ai}</span>
      </p>
      <p className="flex items-start gap-2">
        <span className="text-blue-500">📚</span>
        <span>{t.knowledge}</span>
      </p>
      <p className="flex items-start gap-2">
        <span className="text-blue-500">🔄</span>
        <span>{t.history}</span>
      </p>
    </TutorialBox>
  );
}
