import type { ReactNode } from 'react';

import { flow } from 'fp-ts/lib/function';
import { WandSparklesIcon } from 'lucide-react';

import { formatDate, runTask, tapTaskOption } from '@llm/commons';
import { isSdkAppCreatorApp, type SdkAppT, useSdkForLoggedIn } from '@llm/sdk';
import { useAppUpdateModal } from '~/modules/apps-creator';
import { useCreateChatWithInitialApp } from '~/modules/chats/conversation/hooks';
import { CardRecordPermissions } from '~/modules/permissions';
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
  onAfterEdit?: VoidFunction;
  onAfterArchive?: VoidFunction;
  onAfterUnarchive?: VoidFunction;
};

export function AppCard({ app, ctaButton, onAfterEdit, onAfterArchive, onAfterUnarchive }: AppCardProps) {
  const { showAsOptional } = useAppUpdateModal();
  const { sdks, createRecordGuard } = useSdkForLoggedIn();
  const [createApp, createStatus] = useCreateChatWithInitialApp();

  const [onUnarchive, unarchiveStatus] = useUnarchiveWithNotifications(
    sdks.dashboard.apps.unarchive(app.id),
  );

  const [onArchive, archiveStatus] = useArchiveWithNotifications(
    sdks.dashboard.apps.archive(app.id),
  );

  const recordGuard = createRecordGuard(app);
  const handleEdit = flow(
    showAsOptional,
    tapTaskOption(onAfterEdit ?? (() => {})),
    runTask,
  );

  return (
    <CardBase
      disabled={createStatus.isLoading}
      {...!ctaButton && {
        onClick: () => void createApp(app),
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
            <CardEditButton onClick={() => void handleEdit({ app })} />
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
