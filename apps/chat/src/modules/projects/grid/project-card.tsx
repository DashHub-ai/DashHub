import { flow } from 'fp-ts/lib/function';
import { FolderIcon, FolderOpenIcon } from 'lucide-react';

import type { SdkProjectT } from '@llm/sdk';

import { formatDate, runTask, tapTaskOption } from '@llm/commons';
import { useSdkForLoggedIn } from '@llm/sdk';
import { useI18n } from '~/i18n';
import { CardRecordPermissionsRow } from '~/modules/permissions/card';
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
  useArchiveWithNotifications,
  useUnarchiveWithNotifications,
} from '~/ui';

import { useProjectUpdateModal } from '../form';

type ProjectCardProps = {
  project: SdkProjectT;
  onAfterEdit?: VoidFunction;
  onAfterArchive?: VoidFunction;
  onAfterUnarchive?: VoidFunction;
};

export function ProjectCard({ project, onAfterEdit, onAfterArchive, onAfterUnarchive }: ProjectCardProps) {
  const { pack } = useI18n();

  const sitemap = useSitemap();
  const { sdks, createRecordGuard } = useSdkForLoggedIn();
  const { showAsOptional } = useProjectUpdateModal();

  const [onUnarchive, unarchiveStatus] = useUnarchiveWithNotifications(
    sdks.dashboard.projects.unarchive(project.id),
  );

  const [onArchive, archiveStatus] = useArchiveWithNotifications(
    sdks.dashboard.projects.archive(project.id),
  );

  const recordGuard = createRecordGuard(project);
  const description = project.summary.content.value?.trim();

  const handleEdit = flow(
    showAsOptional,
    tapTaskOption(onAfterEdit ?? (() => {})),
    runTask,
  );

  return (
    <CardBase
      href={sitemap.projects.show.generate({
        pathParams: {
          id: project.id,
        },
      })}
    >
      <CardTitle icon={<FolderIcon size={16} />}>
        {project.name}
      </CardTitle>

      <CardContent>
        {description && (
          <CardDescription className="flex-1">
            {description}
          </CardDescription>
        )}

        <CardBigActions>
          <CardBigActionButton
            variant="secondary"
            icon={<FolderOpenIcon size={16} />}
            href={sitemap.projects.show.generate({
              pathParams: {
                id: project.id,
              },
            })}
          >
            {pack.buttons.open}
          </CardBigActionButton>
        </CardBigActions>

        <CardFooter alignEnd={false}>
          <div className="text-muted-foreground text-xs">
            {formatDate(project.updatedAt)}
          </div>

          <CardRecordPermissionsRow record={project} />
        </CardFooter>
      </CardContent>

      {!project.archived && (recordGuard.can.write || recordGuard.can.archive) && (
        <CardActions>
          {recordGuard.can.write && (
            <CardEditButton onClick={() => void handleEdit({ project })} />
          )}

          {recordGuard.can.archive && (
            <CardArchiveButton
              onClick={() => void onArchive().then(() => onAfterArchive?.())}
              loading={archiveStatus.loading}
            />
          )}
        </CardActions>
      )}

      {project.archived && recordGuard.can.unarchive && (
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
