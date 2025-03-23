import { type SdkProjectT, useSdkForLoggedIn } from '@llm/sdk';
import { useI18n } from '~/i18n';
import { NavigationToolbarPortal } from '~/layouts/navigation/navigation-toolbar-portal';
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
    <section className="flex flex-col bg-background overflow-hidden">
      <NavigationToolbarPortal>
        <ProjectShareRow
          project={project}
          onShared={onShared}
        />
      </NavigationToolbarPortal>

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top area with start chat form */}
        {recordGuard.can.write && (
          <div className="mb-10 p-6 pb-10 border-b">
            <h2 className="mb-6 font-semibold text-2xl text-center">
              {t.hello}
            </h2>
            <StartChatForm forceProject={project} />
          </div>
        )}

        {/* Main content with chats on left and files on right */}
        <div className="flex-1 p-6 overflow-hidden">
          <div className="gap-12 grid grid-cols-1 md:grid-cols-[1fr,350px] h-full">
            {/* Chats section - now on the left */}
            <div className="flex flex-col h-full">
              <h2 className="mb-6 font-semibold text-xl">
                {t.chats}
              </h2>
              <div className="flex-1 overflow-y-auto">
                <ChatsContainer project={project} />
              </div>
            </div>

            {/* Files section - now on the right */}
            <div className="flex flex-col md:pl-12 md:border-l h-full">
              <h2 className="mb-6 font-semibold text-xl">
                {t.files}
              </h2>
              <div className="flex-1 overflow-y-auto">
                <ProjectFilesListContainer
                  projectId={project.id}
                  readOnly={!recordGuard.can.write}
                  compactView
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
