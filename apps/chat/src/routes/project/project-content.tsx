import type { SdkProjectT } from '@llm/sdk';

import { useI18n } from '~/i18n';
import { ChatsContainer, StartChatForm } from '~/modules';

type Props = {
  project: SdkProjectT;
};

export function ProjectContent({ project }: Props) {
  const t = useI18n().pack.routes.project;

  return (
    <>
      <StartChatForm project={project} />

      <hr className="border-gray-200 mx-auto my-12 border-t max-w-2xl" />

      <section>
        <h2 className="mb-6 font-semibold text-2xl text-center">
          {t.chats}
        </h2>

        <ChatsContainer project={project} columns={3} />
      </section>
    </>
  );
}
