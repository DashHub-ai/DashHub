import { taskEither as TE } from 'fp-ts';

import type { SdkProjectT } from '@llm/sdk';

import { useI18n } from '~/i18n';
import { ChatsContainer, StartChatForm } from '~/modules';
import {
  PermissionAvatarsList,
  ShareResourceButton,
} from '~/modules/permissions';
import { ProjectFilesListContainer } from '~/modules/projects/files';

type Props = {
  project: SdkProjectT;
};

export function ProjectContent({ project }: Props) {
  const t = useI18n().pack.routes.project;
  const { permissions } = project;

  return (
    <section className="relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="flex-1 font-semibold text-2xl text-center">
          {t.hello}
        </h2>

        <div className="right-0 absolute flex items-center gap-4">
          <PermissionAvatarsList permissions={permissions?.current ?? []} />
          <ShareResourceButton
            defaultValue={permissions?.current ?? []}
            onSubmit={permissions => TE.fromTask(async () => {
              // eslint-disable-next-line no-console
              console.log(permissions);
            })}
          />
        </div>
      </div>

      <div>
        <StartChatForm forceProject={project} />

        <hr className="border-gray-200 mx-auto my-12 border-t" />

        <div className="gap-16 grid grid-cols-1 md:grid-cols-[1fr,24rem]">
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
