import type { ReactNode } from 'react';

import { MessageCirclePlusIcon, RepeatIcon, WandSparklesIcon } from 'lucide-react';

import { formatDate } from '@llm/commons';
import { isSdkAppCreatorApp, type SdkAppT, useSdkForLoggedIn } from '@llm/sdk';
import { useI18n } from '~/i18n';
import { useCreateChatWithInitialApp } from '~/modules/chats/conversation/hooks';
import { FavoriteStarButton } from '~/modules/favorites';
import { CardRecordPermissions } from '~/modules/permissions';
import { useSitemap } from '~/routes';
import {
  CardActions,
  CardArchiveButton,
  CardBase,
  CardBigActionButton,
  type CardBigActionButtonProps,
  CardBigActions,
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
  onAfterToggleFavorite?: VoidFunction;
};

export function AppCard({ app, ctaButton, onAfterArchive, onAfterUnarchive, onAfterToggleFavorite }: AppCardProps) {
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
          suffix: (
            <FavoriteStarButton
              favorite={{ type: 'app', id: app.id }}
              onAfterToggleFavorite={onAfterToggleFavorite}
            />
          ),
        }}
      >
        {app.name}
      </CardTitle>

      <CardContent>
        <CardDescription>
          {app.description}
        </CardDescription>

        <CardBigActions>
          {app.recentChats.length > 0 && (
            <CardContinueChatButton href={sitemap.apps.recentChatOrFallback(app)} />
          )}

          <CardStartChatButton
            onClick={(e) => {
              e.stopPropagation();
              void createChatWithApp(app);
            }}
          />
        </CardBigActions>

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

function CardStartChatButton({ disabled, loading, ...props }: Omit<CardBigActionButtonProps, 'children'>) {
  const t = useI18n().pack.apps.card;

  return (
    <CardBigActionButton
      icon={<MessageCirclePlusIcon size={18} />}
      disabled={disabled}
      loading={loading}
      variant="primary"
      {...props}
    >
      {t.startChat}
    </CardBigActionButton>
  );
}

function CardContinueChatButton({ disabled, loading, ...props }: Omit<CardBigActionButtonProps, 'children'>) {
  const t = useI18n().pack.apps.card;

  return (
    <CardBigActionButton
      icon={<RepeatIcon size={18} />}
      disabled={disabled}
      loading={loading}
      variant="secondary"
      {...props}
    >
      {t.continueChat}
    </CardBigActionButton>
  );
}
