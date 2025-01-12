import { flow } from 'fp-ts/lib/function';
import { FolderIcon } from 'lucide-react';

import type { SdkProjectT } from '@llm/sdk';

import { formatDate, runTask, tapTaskOption } from '@llm/commons';
import { useSdkForLoggedIn } from '@llm/sdk';
import {
  CardActions,
  CardArchiveButton,
  CardBase,
  CardDescription,
  CardEditButton,
  CardFooter,
  CardOpenButton,
  CardTitle,
  useArchiveWithNotifications,
} from '@llm/ui';
import { CardRecordPermissions } from '~/modules/permissions/card';
import { useSitemap } from '~/routes';

import { useProjectUpdateModal } from '../form';

type ProjectCardProps = {
  project: SdkProjectT;
  onAfterEdit?: VoidFunction;
  onAfterArchive?: VoidFunction;
};

export function ProjectCard({ project, onAfterEdit, onAfterArchive }: ProjectCardProps) {
  const sitemap = useSitemap();
  const { sdks } = useSdkForLoggedIn();
  const { showAsOptional } = useProjectUpdateModal();
  const [onArchive, archiveStatus] = useArchiveWithNotifications(
    sdks.dashboard.projects.archive(project.id),
  );

  const description = project.summary.content.value?.trim();

  const handleEdit = flow(
    showAsOptional,
    tapTaskOption(onAfterEdit ?? (() => {})),
    runTask,
  );

  return (
    <CardBase>
      <CardTitle icon={<FolderIcon size={16} />}>
        {project.name}
      </CardTitle>

      <div className="flex flex-col flex-1 space-y-4">
        {project.permissions && (
          <CardRecordPermissions
            permissions={project.permissions.current}
            className="text-sm"
          />
        )}

        {description && (
          <CardDescription className="flex-1">
            {description}
          </CardDescription>
        )}

        <CardFooter>
          <div className="text-muted-foreground text-xs">
            {formatDate(project.updatedAt)}
          </div>

          <CardOpenButton href={sitemap.projects.show.generate({ pathParams: { id: project.id } })} />
        </CardFooter>
      </div>

      {!project.archived && (
        <CardActions>
          <CardEditButton onClick={() => void handleEdit({ project })} />
          <CardArchiveButton
            onClick={() => void onArchive().then(() => onAfterArchive?.())}
            loading={archiveStatus.loading}
          />
        </CardActions>
      )}
    </CardBase>
  );
}
