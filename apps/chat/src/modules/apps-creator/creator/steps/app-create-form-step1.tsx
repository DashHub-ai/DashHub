import { useI18n } from '~/i18n';
import { InternalConversationPanel } from '~/modules/chats';

import type { StepProps } from './app-create-form-types';

export function AppCreateFormStep1({ onNext, loading }: StepProps) {
  const t = useI18n().pack.appsCreator;

  return (
    <div className="flex flex-col h-[75vh]">
      <InternalConversationPanel
        className="flex-1 overflow-y-auto"
        initialMessage={t.prompts.createApp}
      />

      <div>
        <button
          type="button"
          className="uk-float-right uk-button uk-button-primary"
          onClick={onNext}
          disabled={loading}
        >
          {t.create.nextStep}
        </button>
      </div>
    </div>
  );
}
