import type { SdkProjectT } from '@llm/sdk';

import { ProjectCard } from './project-card';

type Props = {
  items: SdkProjectT[];
};

export function ProjectsGrid({ items }: Props) {
  return (
    <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {items.map((project: any) => (
        <ProjectCard
          key={project.id}
          project={project}
        />
      ))}
    </div>
  );
}
