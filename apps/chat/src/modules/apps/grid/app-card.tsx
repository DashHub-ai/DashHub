import type { ReactNode } from 'react';

import { flow } from 'fp-ts/lib/function';
import { WandSparklesIcon } from 'lucide-react';

import { formatDate, runTask, tapTaskOption } from '@llm/commons';
import { type SdkAppT, useSdkForLoggedIn } from '@llm/sdk';
import {
  CardActions,
  CardArchiveButton,
  CardBase,
  CardContent,
  CardDescription,
  CardEditButton,
  CardFooter,
  CardOpenButton,
  CardTitle,
  useArchiveWithNotifications,
  useUnarchiveWithNotifications,
} from '@llm/ui';
import { useAppUpdateModal } from '~/modules/apps-creator';
import { useCreateChatWithInitialApp } from '~/modules/chats/conversation/hooks';
import { CardRecordPermissions } from '~/modules/permissions';

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
    <CardBase>
      <CardTitle
        icon={<WandSparklesIcon size={16} />}
        {...!app.archived && {
          suffix: <FavoriteAppStarButton app={app} />,
        }}
      >
        {app.name}
      </CardTitle>

      <CardContent>
        {app.permissions && (
          <CardRecordPermissions permissions={app.permissions.current} />
        )}

        <CardDescription>
          {app.description}
        </CardDescription>

        <CardFooter>
          <div className="text-muted-foreground text-xs">
            {formatDate(app.updatedAt)}
          </div>

          {ctaButton || (
            <CardOpenButton
              onClick={() => void createApp(app)}
              loading={createStatus.isLoading}
            />
          )}
        </CardFooter>
      </CardContent>

      {!ctaButton && !app.archived && (recordGuard.can.write || recordGuard.can.archive) && (
        <CardActions>
          {recordGuard.can.write && (
            <CardEditButton onClick={() => void handleEdit({ app })} />
          )}

          {recordGuard.can.archive && (
            <CardArchiveButton
              onClick={() => void onArchive().then(() => onAfterArchive?.())}
              loading={archiveStatus.loading}
            />
          )}
        </CardActions>
      )}

      {!ctaButton && app.archived && recordGuard.can.unarchive && (
        <CardActions>
          <CardArchiveButton
            onClick={() => void onUnarchive().then(() => onAfterUnarchive?.())}
            loading={unarchiveStatus.loading}
          />
        </CardActions>
      )}
    </CardBase>
  );
}
