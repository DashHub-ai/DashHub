import { useI18n } from '~/i18n';
import { TutorialBox } from '~/ui';

export function ChooseOrganizationTutorial() {
  const t = useI18n().pack.routes.chooseOrganization.tutorial;

  return (
    <TutorialBox
      title={t.title}
      icon="🏢"
      id="choose-organization-tutorial"
      withHideToolbar={false}
    >
      <p className="flex items-start gap-2">
        <span className="text-amber-500">🔄</span>
        <span>{t.select}</span>
      </p>
      <p className="flex items-start gap-2">
        <span className="text-amber-500">📊</span>
        <span>{t.dashboard}</span>
      </p>
      <p className="flex items-start gap-2 max-w-[500px]">
        <span className="text-amber-500">👑</span>
        <span>{t.rootOnly}</span>
      </p>
    </TutorialBox>
  );
}
