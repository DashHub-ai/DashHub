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
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-semibold text-2xl">
          {t.hello}
        </h2>

        <div className="flex items-center gap-4">
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

      <div className="flex gap-8">
        <div className="flex-1">
          <StartChatForm forceProject={project} />

          <hr className="border-gray-200 mx-auto my-12 border-t max-w-2xl" />

          <h2 className="mb-6 font-semibold text-2xl">
            {t.chats}
          </h2>

          <ChatsContainer project={project} columns={2} />
        </div>

        <div className="border-gray-200 pl-8 border-l w-[28rem]">
          <ProjectFilesListContainer projectId={project.id} />
        </div>
      </div>
    </section>
  );
}
