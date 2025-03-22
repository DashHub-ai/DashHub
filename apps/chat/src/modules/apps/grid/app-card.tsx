import type { ReactNode } from 'react';

import { WandSparklesIcon } from 'lucide-react';

import { formatDate } from '@llm/commons';
import { isSdkAppCreatorApp, type SdkAppT, useSdkForLoggedIn } from '@llm/sdk';
import { useCreateChatWithInitialApp } from '~/modules/chats/conversation/hooks';
import { FavoriteStarButton } from '~/modules/favorites';
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

export type AppCardProps = {
  app: SdkAppT;
  ctaButton?: ReactNode;
  onAfterArchive?: VoidFunction;
  onAfterUnarchive?: VoidFunction;
};

export function AppCard({ app, ctaButton, onAfterArchive, onAfterUnarchive }: AppCardProps) {
  const sitemap = useSitemap();

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
          suffix: <FavoriteStarButton favorite={{ type: 'app', id: app.id }} />,
        }}
      >
        {app.name}
      </CardTitle>

      <CardContent>
        <CardDescription>
          {app.description}
        </CardDescription>

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
