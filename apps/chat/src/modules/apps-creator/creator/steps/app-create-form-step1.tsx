import { pipe } from 'fp-ts/lib/function';
import { useState } from 'react';

import { runTaskAsVoid, tapTaskEither, tryOrThrowTE } from '@llm/commons';
import { useAsyncCallback } from '@llm/commons-front';
import {
  type SdkAppFromChatT,
  type SdkChatT,
  type SdkTableRowWithUuidT,
  useSdkForLoggedIn,
} from '@llm/sdk';
import { FormSpinnerCTA } from '@llm/ui';
import { useI18n } from '~/i18n';
import { InternalConversationPanel } from '~/modules/chats';

type Props = {
  loading: boolean;
  onNext: (chat: SdkAppFromChatT) => void;
};

export function AppCreateFormStep1({ onNext, loading }: Props) {
  const [chat, setChat] = useState<SdkChatT | null>(null);
  const t = useI18n().pack.appsCreator;

  const { sdks } = useSdkForLoggedIn();
  const [onSummarizeChat, summarizeState] = useAsyncCallback(
    async (chat: SdkTableRowWithUuidT) => pipe(
      sdks.dashboard.apps.summarizeChatToApp(chat.id),
      tapTaskEither(onNext),
      tryOrThrowTE,
      runTaskAsVoid,
    ),
  );

  return (
    <div className="flex flex-col h-[75vh]">
      <InternalConversationPanel
        className="flex-1 overflow-y-auto"
        initialMessage={t.prompts.createApp}
        onChatCreated={setChat}
      />

      <div>
        <FormSpinnerCTA
          type="button"
          loading={summarizeState.isLoading}
          className="uk-float-right"
          onClick={() => {
            if (chat) {
              void onSummarizeChat(chat);
            }
          }}
          disabled={loading || !chat}
        >
          {t.create.nextStep}
        </FormSpinnerCTA>
      </div>
    </div>
  );
}
