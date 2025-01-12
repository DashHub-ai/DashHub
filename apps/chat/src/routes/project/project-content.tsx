import { type SdkProjectT, useSdkForLoggedIn } from '@llm/sdk';
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
  const recordGuard = useSdkForLoggedIn().createRecordGuard(project);

  return (
    <section className="relative">
      {recordGuard.can.write && (
        <div className="flex justify-between items-center mb-6">
          <h2 className="flex-1 font-semibold text-2xl text-center">
            {t.hello}
          </h2>

          <ProjectShareRow
            project={project}
            onShared={onShared}
          />
        </div>
      )}

      <div>
        {recordGuard.can.write && (
          <>
            <StartChatForm forceProject={project} />

            <hr className="border-gray-200 my-14 border-t" />
          </>
        )}

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

            <ProjectFilesListContainer
              projectId={project.id}
              readOnly={!recordGuard.can.write}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
