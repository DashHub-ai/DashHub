import type { SdkTableRowWithIdNameT } from '@llm/sdk';

import { formatDate } from '@llm/commons';

type ChatCardProps = {
  title: string;
  project: SdkTableRowWithIdNameT;
  createdAt: Date;
};

export function ChatCard({ title, project, createdAt }: ChatCardProps) {
  return (
    <div className="hover:shadow-md p-4 border rounded-lg transition-shadow">
      <p className="mb-2 text-muted-foreground text-xs">
        {project.name}
      </p>
      <h3 className="mb-4 font-medium">{title}</h3>
      <div className="mt-auto text-muted-foreground text-xs">
        {formatDate(createdAt)}
      </div>
    </div>
  );
}
