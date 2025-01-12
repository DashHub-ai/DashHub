import type { ReactNode } from 'react';

import clsx from 'clsx';
import { flow } from 'fp-ts/lib/function';
import { StarIcon, WandSparklesIcon } from 'lucide-react';

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
} from '@llm/ui';
import { useI18n } from '~/i18n';
import { useAppUpdateModal } from '~/modules/apps-creator';
import { useCreateChatWithInitialApp } from '~/modules/chats/conversation/hooks';
import { CardRecordPermissions } from '~/modules/permissions';

import { useFavoriteApps } from '../favorite';

export type AppCardProps = {
  app: SdkAppT;
  ctaButton?: ReactNode;
  onAfterEdit?: VoidFunction;
  onAfterArchive?: VoidFunction;
};

export function AppCard({ app, ctaButton, onAfterEdit, onAfterArchive }: AppCardProps) {
  const t = useI18n().pack;
  const { isFavorite, toggle } = useFavoriteApps();
  const { showAsOptional } = useAppUpdateModal();
  const { sdks } = useSdkForLoggedIn();
  const favorite = isFavorite(app);
  const [createApp, createStatus] = useCreateChatWithInitialApp();
  const [onArchive, archiveStatus] = useArchiveWithNotifications(
    sdks.dashboard.apps.archive(app.id),
  );

  const handleEdit = flow(
    showAsOptional,
    tapTaskOption(onAfterEdit ?? (() => {})),
    runTask,
  );

  return (
    <CardBase>
      {!app.archived && (
        <button
          type="button"
          className={clsx(
            'top-4 right-4 absolute',
            favorite
              ? 'text-yellow-500 hover:text-yellow-600'
              : 'text-muted-foreground hover:text-primary',
          )}
          title={t.apps.favorites[favorite ? 'remove' : 'add']}
          aria-label={t.apps.favorites[favorite ? 'remove' : 'add']}
          onClick={() => toggle(app)}
        >
          <StarIcon
            size={20}
            {...favorite ? { strokeWidth: 0, fill: 'currentColor' } : {}}
          />
        </button>
      )}

      <CardTitle icon={<WandSparklesIcon size={16} />}>
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

      {!ctaButton && !app.archived && (
        <CardActions>
          <CardEditButton onClick={() => void handleEdit({ app })} />
          <CardArchiveButton
            onClick={() => void onArchive().then(() => onAfterArchive?.())}
            loading={archiveStatus.loading}
          />
        </CardActions>
      )}
    </CardBase>
  );
}
