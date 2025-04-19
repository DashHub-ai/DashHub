import type { ReactNode } from 'react';

import { WebhookIcon } from 'lucide-react';

import { formatDate } from '@llm/commons';
import { type SdkSearchAIExternalAPIItemT, useSdkForLoggedIn } from '@llm/sdk';
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

export type AIExternalAPICardProps = {
  api: SdkSearchAIExternalAPIItemT;
  ctaButton?: ReactNode;
  onAfterArchive?: VoidFunction;
  onAfterUnarchive?: VoidFunction;
};

export function AIExternalAPICard({ api, ctaButton, onAfterArchive, onAfterUnarchive }: AIExternalAPICardProps) {
  const sitemap = useSitemap();

  const { sdks, createRecordGuard } = useSdkForLoggedIn();
  const [createChatWithApp, createStatus] = useCreateChatWithInitialApp();

  const [onUnarchive, unarchiveStatus] = useUnarchiveWithNotifications(
    sdks.dashboard.apps.unarchive(api.id),
  );

  const [onArchive, archiveStatus] = useArchiveWithNotifications(
    sdks.dashboard.apps.archive(api.id),
  );

  const recordGuard = createRecordGuard(api);

  return (
    <CardBase
      disabled={createStatus.isLoading}
      {...!ctaButton && {
        onClick: () => void createChatWithApp(api),
      }}
    >
      <CardTitle icon={<WebhookIcon size={16} />}>
        {api.name}
      </CardTitle>

      <CardContent>
        <CardDescription>
          {api.description}
        </CardDescription>

        <CardFooter>
          <div className="text-muted-foreground text-xs">
            {formatDate(api.updatedAt)}
          </div>

          {!ctaButton && api.permissions && (
            <CardRecordPermissions permissions={api.permissions.current} />
          )}

          {ctaButton}
        </CardFooter>
      </CardContent>

      {!ctaButton && !api.archived && (recordGuard.can.write || recordGuard.can.archive) && (
        <CardActions>
          {recordGuard.can.write && (
            <CardEditButton href={sitemap.apps.update.generate({ pathParams: { id: api.id } })} />
          )}

          {recordGuard.can.archive && (
            <CardArchiveButton
              loading={archiveStatus.loading}
              onClick={() => void onArchive().then(() => onAfterArchive?.())}
            />
          )}
        </CardActions>
      )}

      {!ctaButton && api.archived && recordGuard.can.unarchive && (
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
