import type { SdkTableRowWithIdNameT } from '@llm/sdk';

import { formatDate } from '@llm/commons';
import { UkIcon } from '@llm/ui';

type ChatCardProps = {
  title: string;
  project: SdkTableRowWithIdNameT;
  createdAt: Date;
};

export function ChatCard({ title, project, createdAt }: ChatCardProps) {
  return (
    <div className="flex flex-col bg-white shadow-sm hover:shadow-md p-4 pb-2 border border-border/50 rounded-lg transition-shadow">
      <div className="flex items-center gap-2 mb-2">
        <div className="text-muted-foreground">
          <UkIcon icon="message-square-text" />
        </div>
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="flex-1 mb-4 text-muted-foreground text-sm">
        {project.name}
      </p>
      <div className="flex flex-row justify-between items-center">
        <div className="text-muted-foreground text-xs">
          {formatDate(createdAt)}
        </div>

        <a href="#" className="uk-button uk-button-secondary uk-button-small">
          <UkIcon icon="external-link" className="mr-2" />
          Open
        </a>
      </div>
    </div>
  );
}
