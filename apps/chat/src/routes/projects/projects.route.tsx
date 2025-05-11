import { pipe } from 'fp-ts/lib/function';
import { FolderPlusIcon } from 'lucide-react';

import { tapTaskOption } from '@dashhub/commons';
import { useAsyncCallback, useForceRerender } from '@dashhub/commons-front';
import { useI18n } from '~/i18n';
import { LayoutHeader, PageWithSidebarLayout } from '~/layouts';
import { ProjectsContainer } from '~/modules';
import { useProjectCreateModal } from '~/modules/projects/form';
import { RouteMetaTags } from '~/routes/shared';
import { FormSpinnerCTA } from '~/ui';

import { ProjectsTutorial } from './projects-tutorial';

export function ProjectsRoute() {
  const t = useI18n().pack.routes.projects;

  const { revision, forceRerender } = useForceRerender();
  const createModal = useProjectCreateModal();
  const [onCreate, createState] = useAsyncCallback(
    pipe(
      createModal.showAsOptional({
        defaultValue: {
          name: '',
          summary: { content: { generated: true, value: null } },
        },
      }),
      tapTaskOption(forceRerender),
    ),
  );

  return (
    <PageWithSidebarLayout>
      <RouteMetaTags meta={t.meta} />

      <LayoutHeader>
        {t.title}
      </LayoutHeader>

      <ProjectsTutorial />

      <ProjectsContainer
        key={revision}
        storeDataInUrl
        toolbar={(
          <FormSpinnerCTA
            className="uk-button-small"
            loading={createState.isLoading}
            onClick={() => void onCreate()}
          >
            {!createState.isLoading && <FolderPlusIcon className="mr-2" size={16} />}
            {t.buttons.create}
          </FormSpinnerCTA>
        )}
      />
    </PageWithSidebarLayout>
  );
}
