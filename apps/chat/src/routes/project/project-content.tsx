import type { SdkProjectT } from '@llm/sdk';

import { useI18n } from '~/i18n';
import { ChatsContainer, StartChatForm } from '~/modules';
import { ProjectFilesListContainer } from '~/modules/projects/files';

import { ProjectShareRow } from './project-share-row';

type Props = {
  project: SdkProjectT;
  onShared: VoidFunction;
};

export function ProjectContent({ project, onShared }: Props) {
  const t = useI18n().pack.routes.project;

  return (
    <section className="relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="flex-1 font-semibold text-2xl text-center">
          {t.hello}
        </h2>

        <ProjectShareRow
          project={project}
          onShared={onShared}
        />
      </div>

      <div className="space-y-16">
        <StartChatForm forceProject={project} />

        <div className="gap-16 grid grid-cols-1 md:grid-cols-[1fr,26rem]">
          <div>
            <h2 className="mb-6 font-semibold text-2xl">
              {t.chats}
            </h2>

            <ChatsContainer project={project} />
          </div>

          <div>
            <h2 className="mb-6 font-semibold text-2xl">
              {t.files}
            </h2>

            <ProjectFilesListContainer projectId={project.id} />
          </div>
        </div>
      </div>
    </section>
  );
}
