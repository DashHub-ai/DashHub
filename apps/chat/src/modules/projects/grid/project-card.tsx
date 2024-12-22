import { flow } from 'fp-ts/lib/function';
import { FolderIcon } from 'lucide-react';

import type { SdkProjectT } from '@llm/sdk';

import { formatDate, runTask, tapTaskOption } from '@llm/commons';
import { useSdkForLoggedIn } from '@llm/sdk';
import { useArchiveWithNotifications } from '@llm/ui';
import {
  CardActions,
  CardArchiveButton,
  CardBase,
  CardDescription,
  CardEditButton,
  CardFooter,
  CardOpenButton,
  CardTitle,
} from '~/modules/shared/card';
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

  const description = project.description?.trim();

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

      {description
        ? (
            <CardDescription>
              {description}
            </CardDescription>
          )
        : <div className="flex-1" />}

      <CardFooter>
        <div className="text-muted-foreground text-xs">
          {formatDate(project.updatedAt)}
        </div>

        <CardOpenButton href={sitemap.projects.show.generate({ pathParams: { id: project.id } })} />
      </CardFooter>

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
