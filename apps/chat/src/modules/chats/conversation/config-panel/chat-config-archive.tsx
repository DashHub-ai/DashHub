import { Trash2Icon } from 'lucide-react';

import { TutorialBox } from '~/components';
import { useI18n } from '~/i18n';

export function ChatConfigArchive() {
  const t = useI18n().pack.chat.config.archive;

  return (
    <TutorialBox
      id="chat-config-panel-archive"
      variant="red"
      icon="📦"
      title={t.title}
      className="mt-10"
      withHideToolbar={false}
    >
      <p className="mb-4 text-gray-600 text-sm">
        {t.description}
      </p>

      <button type="button" className="uk-button uk-button-danger">
        <Trash2Icon size={16} className="mr-2" />
        {t.button}
      </button>
    </TutorialBox>
  );
}
