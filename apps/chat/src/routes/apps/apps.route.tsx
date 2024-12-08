import { pipe } from 'fp-ts/lib/function';
import { WandSparklesIcon } from 'lucide-react';

import { tapTaskOption } from '@llm/commons';
import { useAsyncCallback, useForceRerender } from '@llm/commons-front';
import { createFakeSelectItem, FormSpinnerCTA } from '@llm/ui';
import { useI18n } from '~/i18n';
import { LayoutHeader, PageWithNavigationLayout } from '~/layouts';
import { AppsContainer, useAppCreateModal } from '~/modules';
import { RouteMetaTags } from '~/routes';

import { AppsTutorial } from './apps-tutorial';

export function AppsRoute() {
  const t = useI18n().pack.routes.apps;

  const { revision, forceRerender } = useForceRerender();
  const createModal = useAppCreateModal();
  const [onCreate, createState] = useAsyncCallback(
    pipe(
      createModal.showAsOptional({
        defaultValue: {
          name: '',
          chatContext: '',
          description: '',
          category: createFakeSelectItem(),
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

      <AppsTutorial />

      <AppsContainer
        key={revision}
        toolbar={(
          <FormSpinnerCTA
            className="uk-button-small"
            loading={createState.isLoading}
            onClick={() => void onCreate()}
          >
            {!createState.isLoading && <WandSparklesIcon className="mr-2" size={16} />}
            {t.buttons.create}
          </FormSpinnerCTA>
        )}
      />
    </PageWithNavigationLayout>
  );
}
