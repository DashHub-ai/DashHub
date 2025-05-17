import type { ReactNode } from 'react';

import { ZapIcon } from 'lucide-react';

import { formatDate } from '@dashhub/commons';
import { type SdkSearchAIExternalAPIItemT, useSdkForLoggedIn } from '@dashhub/sdk';
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
      <CardTitle icon={<ZapIcon size={16} />}>
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
