import { pipe } from 'fp-ts/lib/function';
import { FolderPlusIcon } from 'lucide-react';

import { tapTaskOption } from '@llm/commons';
import { useAsyncCallback, useForceRerender } from '@llm/commons-front';
import { FormSpinnerCTA } from '@llm/ui';
import { useI18n } from '~/i18n';
import { LayoutHeader, PageWithNavigationLayout } from '~/layouts';
import { ProjectsContainer } from '~/modules';
import { useProjectCreateModal } from '~/modules/projects/form';
import { RouteMetaTags } from '~/routes/shared';

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
          description: '',
        },
      }),
      tapTaskOption(forceRerender),
    ),
  );

  return (
    <PageWithNavigationLayout>
      <RouteMetaTags meta={t.meta} />

      <LayoutHeader>
        {t.title}
      </LayoutHeader>

      <ProjectsTutorial />

      <ProjectsContainer
        key={revision}
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
    </PageWithNavigationLayout>
  );
}
