import { flow } from 'fp-ts/lib/function';
import { ExternalLinkIcon, FolderIcon } from 'lucide-react';

import type { SdkProjectT } from '@llm/sdk';

import { formatDate, runTask, tapTaskOption } from '@llm/commons';
import { useSdkForLoggedIn } from '@llm/sdk';
import { useArchiveWithNotifications } from '@llm/ui';
import { useI18n } from '~/i18n';
import {
  CardActions,
  CardArchiveButton,
  CardBase,
  CardDescription,
  CardEditButton,
  CardFooter,
  CardTitle,
} from '~/modules/shared/card';

import { useProjectUpdateModal } from '../form';

type ProjectCardProps = {
  project: SdkProjectT;
  onAfterEdit?: VoidFunction;
  onAfterArchive?: VoidFunction;
};

export function ProjectCard({ project, onAfterEdit, onAfterArchive }: ProjectCardProps) {
  const t = useI18n().pack;
  const { sdks } = useSdkForLoggedIn();
  const { showAsOptional } = useProjectUpdateModal();
  const [onArchive, archiveStatus] = useArchiveWithNotifications(
    sdks.dashboard.projects.archive(project.id),
  );

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

      <CardDescription>
        {project.description?.trim() || t.placeholders.noDescription}
      </CardDescription>

      <CardFooter>
        <div className="text-muted-foreground text-xs">
          {formatDate(project.updatedAt)}
        </div>

        <a href="#" className="uk-button uk-button-secondary uk-button-small">
          <ExternalLinkIcon size={16} className="mr-2" />
          {t.buttons.open}
        </a>
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
