import { ExternalLinkIcon, MessageSquareTextIcon } from 'lucide-react';

import type { SdkTableRowWithIdNameT } from '@llm/sdk';

import { formatDate } from '@llm/commons';

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
          <MessageSquareTextIcon size={16} />
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
          <ExternalLinkIcon size={16} className="mr-2" />
          Open
        </a>
      </div>
    </div>
  );
}
