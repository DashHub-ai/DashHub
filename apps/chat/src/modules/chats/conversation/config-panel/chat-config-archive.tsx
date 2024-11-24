import { pipe } from 'fp-ts/function';
import { Trash2Icon } from 'lucide-react';
import { memo } from 'react';
import { useLocation } from 'wouter';

import type { SdkTableRowWithUuidT } from '@llm/sdk';

import { tapTaskEither } from '@llm/commons';
import { useSdkForLoggedIn } from '@llm/sdk';
import { useArchiveWithNotifications } from '@llm/ui';
import { TutorialBox } from '~/components';
import { useI18n } from '~/i18n';
import { useSitemap } from '~/routes';

type Props = {
  chat: SdkTableRowWithUuidT;
};

export const ChatConfigArchive = memo(({ chat }: Props) => {
  const t = useI18n().pack.chat.config.archive;
  const [, navigate] = useLocation();
  const sitemap = useSitemap();
  const { sdks } = useSdkForLoggedIn();

  const [onArchive, { loading }] = useArchiveWithNotifications(
    pipe(
      sdks.dashboard.chats.archive(chat.id),
      tapTaskEither(() => {
        navigate(sitemap.home);
      }),
    ),
  );

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

      <button
        type="button"
        className="uk-button uk-button-danger"
        disabled={loading}
        onClick={onArchive}
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
            : <Trash2Icon size={16} className="mr-2" />
        )}
        {t.button}
      </button>
    </TutorialBox>
  );
});
