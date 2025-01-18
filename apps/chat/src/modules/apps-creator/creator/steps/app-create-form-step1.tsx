import { task as T, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { useState } from 'react';

import { runTaskAsVoid, tapTaskEither, tryOrThrowTE } from '@llm/commons';
import { useAsyncCallback, useAsyncValue } from '@llm/commons-front';
import {
  type SdkAppFromChatT,
  type SdkChatT,
  type SdkTableRowWithUuidT,
  useSdkForLoggedIn,
} from '@llm/sdk';
import { FormSpinnerCTA, SpinnerContainer } from '@llm/ui';
import { useI18n } from '~/i18n';
import { InternalConversationPanel } from '~/modules/chats';

type Props = {
  loading: boolean;
  onNext: (chat: SdkAppFromChatT) => void;
};

export function AppCreateFormStep1({ onNext, loading }: Props) {
  const [chat, setChat] = useState<SdkChatT | null>(null);
  const { pack } = useI18n();
  const t = pack.appsCreator;

  const { sdks } = useSdkForLoggedIn();
  const [onSummarizeChat, summarizeState] = useAsyncCallback(
    async (chat: SdkTableRowWithUuidT) => pipe(
      sdks.dashboard.apps.summarizeChatToApp(chat.id),
      tapTaskEither(onNext),
      tryOrThrowTE,
      runTaskAsVoid,
    ),
  );

  const appCreatorApp = useAsyncValue(
    pipe(
      sdks.dashboard.apps.getAppCreatorApp(),
      TE.getOrElseW((error) => {
        console.error(error);

        return T.of(null);
      }),
    ),
    [],
  );

  return (
    <div className="flex flex-col h-[75vh]">
      {appCreatorApp.isLoading && <SpinnerContainer className="flex-1" />}
      {appCreatorApp.status === 'success' && (
        <InternalConversationPanel
          className="flex-1 overflow-y-auto"
          initialApp={appCreatorApp.data}
          onChatCreated={setChat}
        />
      )}

      <div className="mt-5">
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
