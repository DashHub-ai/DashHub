import { TutorialBox } from '~/components';
import { useI18n } from '~/i18n';

export function ChatConfigTutorial() {
  const t = useI18n().pack.chat.config.tutorial;

  return (
    <TutorialBox
      variant="green"
      title={t.title}
      icon="⚙️"
      className="mb-4"
      id="chat-config-tutorial"
      showIconAsBackground
    >
      <p className="flex items-start gap-2">
        <span className="text-blue-500">📝</span>
        <span>{t.help.title}</span>
      </p>

      <p className="flex items-start gap-2">
        <span className="text-blue-500">🤖</span>
        <span>{t.help.autoGenerate}</span>
      </p>
    </TutorialBox>
  );
}
