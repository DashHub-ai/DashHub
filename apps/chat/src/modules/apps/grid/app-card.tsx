import type { ReactNode } from 'react';

import { PlayIcon, WandSparklesIcon } from 'lucide-react';

import { formatDate } from '@llm/commons';
import { isSdkAppCreatorApp, type SdkAppT, useSdkForLoggedIn } from '@llm/sdk';
import { useI18n } from '~/i18n';
import { useCreateChatWithInitialApp } from '~/modules/chats/conversation/hooks';
import { CardRecordPermissions } from '~/modules/permissions';
import { useSitemap } from '~/routes';
import {
  CardActions,
  CardArchiveButton,
  CardBase,
  CardContent,
  CardDescription,
  CardEditButton,
  CardFooter,
  CardTitle,
  CardUnarchiveButton,
  useArchiveWithNotifications,
  useUnarchiveWithNotifications,
} from '~/ui';

import { FavoriteAppStarButton } from '../favorite';

export type AppCardProps = {
  app: SdkAppT;
  ctaButton?: ReactNode;
  onAfterArchive?: VoidFunction;
  onAfterUnarchive?: VoidFunction;
};

export function AppCard({ app, ctaButton, onAfterArchive, onAfterUnarchive }: AppCardProps) {
  const sitemap = useSitemap();
  const t = useI18n().pack.apps;

  const { sdks, createRecordGuard } = useSdkForLoggedIn();
  const [createChatWithApp, createStatus] = useCreateChatWithInitialApp();

  const [onUnarchive, unarchiveStatus] = useUnarchiveWithNotifications(
    sdks.dashboard.apps.unarchive(app.id),
  );

  const [onArchive, archiveStatus] = useArchiveWithNotifications(
    sdks.dashboard.apps.archive(app.id),
  );

  const recordGuard = createRecordGuard(app);

  return (
    <CardBase
      disabled={createStatus.isLoading}
      {...!ctaButton && {
        onClick: () => void createChatWithApp(app),
      }}
    >
      <CardTitle
        icon={<WandSparklesIcon size={16} />}
        {...!app.archived && {
          suffix: <FavoriteAppStarButton app={app} />,
        }}
      >
        {app.name}
      </CardTitle>

      <CardContent>
        <CardDescription>
          {app.description}
        </CardDescription>

        {!ctaButton && (
          <div className="flex justify-center mt-4">
            <button
              type="button"
              className="flex justify-center items-center bg-green-600 hover:bg-green-700 shadow-sm px-4 py-2 rounded-md w-full font-bold text-white text-sm transition-colors"
              disabled={createStatus.isLoading}
              onClick={(e) => {
                e.stopPropagation();
                void createChatWithApp(app);
              }}
            >
              {t.card.run}
              <PlayIcon className="ml-2" size={16} />
            </button>
          </div>
        )}

        <CardFooter>
          <div className="text-muted-foreground text-xs">
            {formatDate(app.updatedAt)}
          </div>

          {!ctaButton && app.permissions && (
            <CardRecordPermissions permissions={app.permissions.current} />
          )}

          {ctaButton}
        </CardFooter>
      </CardContent>

      {!ctaButton && !app.archived && (recordGuard.can.write || recordGuard.can.archive) && (
        <CardActions>
          {recordGuard.can.write && (
            <CardEditButton href={sitemap.apps.update.generate({ pathParams: { id: app.id } })} />
          )}

          {recordGuard.can.archive && (
            <CardArchiveButton
              disabled={isSdkAppCreatorApp(app)}
              loading={archiveStatus.loading}
              onClick={() => void onArchive().then(() => onAfterArchive?.())}
            />
          )}
        </CardActions>
      )}

      {!ctaButton && app.archived && recordGuard.can.unarchive && (
        <CardActions>
          <CardUnarchiveButton
            onClick={() => void onUnarchive().then(() => onAfterUnarchive?.())}
            loading={unarchiveStatus.loading}
          />
        </CardActions>
      )}
    </CardBase>
  );
}
