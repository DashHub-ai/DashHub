import { pipe } from 'fp-ts/function';
import { RefreshCwIcon } from 'lucide-react';
import { memo } from 'react';
import { useLocation } from 'wouter';

import type { SdkChatT } from '@llm/sdk';

import { tapTaskEither } from '@llm/commons';
import { useSdkForLoggedIn } from '@llm/sdk';
import { TutorialBox, useUnarchiveWithNotifications } from '@llm/ui';
import { useI18n } from '~/i18n';
import { useSitemap } from '~/routes';

type Props = {
  chat: SdkChatT;
};

export const ChatConfigUnarchive = memo(({ chat }: Props) => {
  const t = useI18n().pack.chat.config.unarchive;
  const [, navigate] = useLocation();
  const sitemap = useSitemap();
  const { sdks } = useSdkForLoggedIn();

  const [onUnarchive, { loading }] = useUnarchiveWithNotifications(
    pipe(
      sdks.dashboard.chats.unarchive(chat.id),
      tapTaskEither(() => {
        const url = sitemap.chat.generate({
          pathParams: {
            id: chat.id,
          },
        });

        navigate(sitemap.forceRedirect.generate(url), { replace: true });
      }),
    ),
  );

  return (
    <TutorialBox
      id="chat-config-panel-unarchive"
      variant="blue"
      icon="📬"
      title={t.title}
      className="mt-10"
      withHideToolbar={false}
      showIconAsBackground
    >
      <p className="mb-4 text-gray-600 text-sm">
        {t.description}
      </p>

      <button
        type="button"
        className="uk-button uk-button-primary"
        disabled={loading}
        onClick={onUnarchive}
      >
        {(
          loading
            ? (
                <span
                  className="mr-2 uk-icon uk-spinner"
                  role="status"
                  uk-spinner="ratio: 0.54"
                />
              )
            : <RefreshCwIcon size={16} className="mr-2" />
        )}
        {t.button}
      </button>
    </TutorialBox>
  );
});
