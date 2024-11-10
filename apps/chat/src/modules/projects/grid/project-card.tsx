import type { SdkProjectT } from '@llm/sdk';

import { formatDate } from '@llm/commons';
import { UkIcon } from '@llm/ui';
import { useI18n } from '~/i18n';

type ProjectCardProps = {
  project: SdkProjectT;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const t = useI18n().pack;

  return (
    <div className="flex flex-col bg-white shadow-sm hover:shadow-md p-4 pb-2 border border-border/50 rounded-lg transition-shadow">
      <div className="flex items-center gap-2 mb-2">
        <div className="text-muted-foreground">
          <UkIcon icon="folder" />
        </div>
        <h3 className="font-medium">{project.name}</h3>
      </div>
      <p className="flex-1 mb-4 line-clamp-2 text-muted-foreground text-sm">
        {project.description}
      </p>
      <div className="flex flex-row justify-between items-center">
        <div className="text-muted-foreground text-xs">
          {formatDate(project.updatedAt)}
        </div>

        <a href="#" className="uk-button uk-button-secondary uk-button-small">
          <UkIcon icon="external-link" className="mr-2" />
          {t.buttons.open}
        </a>
      </div>
    </div>
  );
}
