import type { ReactNode } from 'react';

import { FolderOpenIcon, WebhookIcon } from 'lucide-react';

import { formatDate } from '@llm/commons';
import { type SdkSearchAIExternalAPIItemT, useSdkForLoggedIn } from '@llm/sdk';
import { useI18n } from '~/i18n';
import { CardRecordPermissions } from '~/modules/permissions';
import { useSitemap } from '~/routes';
import {
  CardActions,
  CardArchiveButton,
  CardBase,
  CardBigActionButton,
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

export type AIExternalAPICardProps = {
  api: SdkSearchAIExternalAPIItemT;
  ctaButton?: ReactNode;
  onAfterArchive?: VoidFunction;
  onAfterUnarchive?: VoidFunction;
};

export function AIExternalAPICard({ api, ctaButton, onAfterArchive, onAfterUnarchive }: AIExternalAPICardProps) {
  const { pack } = useI18n();
  const sitemap = useSitemap();
  const { sdks, createRecordGuard } = useSdkForLoggedIn();

  const [onUnarchive, unarchiveStatus] = useUnarchiveWithNotifications(
    sdks.dashboard.aiExternalAPIs.unarchive(api.id),
  );

  const [onArchive, archiveStatus] = useArchiveWithNotifications(
    sdks.dashboard.aiExternalAPIs.archive(api.id),
  );

  const recordGuard = createRecordGuard(api);

  return (
    <CardBase
      href={sitemap.aiExternalAPIs.update.generate({
        pathParams: {
          id: api.id,
        },
      })}
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

        <CardBigActions>
          <CardBigActionButton
            variant="secondary"
            icon={<FolderOpenIcon size={16} />}
            href={sitemap.projects.show.generate({
              pathParams: {
                id: api.id,
              },
            })}
          >
            {pack.buttons.open}
          </CardBigActionButton>
        </CardBigActions>
      </CardContent>

      {!ctaButton && !api.archived && (recordGuard.can.write || recordGuard.can.archive) && (
        <CardActions>
          {recordGuard.can.write && (
            <CardEditButton href={sitemap.aiExternalAPIs.update.generate({ pathParams: { id: api.id } })} />
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
