import type { taskEither as TE } from 'fp-ts';

import type { TaggedError } from '@llm/commons';

import { castSdkProjectToUpdateInput, type SdkProjectT, type SdkUpdateProjectInputT } from '@llm/sdk';
import { useI18n } from '~/i18n';
import { ChatsContainer, StartChatForm } from '~/modules';
import {
  PermissionAvatarsList,
  ShareResourceButton,
} from '~/modules/permissions';
import { ProjectFilesListContainer } from '~/modules/projects/files';

type Props = {
  project: SdkProjectT;
  onUpdate: (value: SdkUpdateProjectInputT) => TE.TaskEither<TaggedError<string>, unknown>;
};

export function ProjectContent({ project, onUpdate }: Props) {
  const t = useI18n().pack.routes.project;
  const { creator, permissions } = project;

  return (
    <section className="relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="flex-1 font-semibold text-2xl text-center">
          {t.hello}
        </h2>

        <div className="right-0 absolute flex items-center gap-6">
          <PermissionAvatarsList permissions={permissions?.current ?? []} />
          <ShareResourceButton
            creator={creator}
            defaultValue={permissions?.current ?? []}
            onSubmit={permissions => onUpdate({
              ...castSdkProjectToUpdateInput(project),
              permissions,
            })}
          />
        </div>
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
