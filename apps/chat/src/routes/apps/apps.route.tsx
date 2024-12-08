import { pipe } from 'fp-ts/lib/function';
import { WandSparklesIcon } from 'lucide-react';

import { tapTaskOption } from '@llm/commons';
import { useAsyncCallback } from '@llm/commons-front';
import { createFakeSelectItem, FormSpinnerCTA } from '@llm/ui';
import { useI18n } from '~/i18n';
import { LayoutHeader, PageWithNavigationLayout } from '~/layouts';
import { AppsContainer, useAppCreateModal } from '~/modules';
import { RouteMetaTags } from '~/routes';

import { AppsTutorial } from './apps-tutorial';

export function AppsRoute() {
  const t = useI18n().pack.routes.apps;
  const createModal = useAppCreateModal();
  const [onCreate, createState] = useAsyncCallback(
    pipe(
      createModal.showAsOptional({
        defaultValue: {
          name: '',
          chatContext: '',
          description: '',
          category: createFakeSelectItem(),
          organization: createFakeSelectItem(),
        },
      }),
      tapTaskOption((result) => {
        // eslint-disable-next-line no-console
        console.info(result);
      }),
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
        toolbar={(
          <FormSpinnerCTA
            className="uk-button-small"
            loading={createState.isLoading}
            onClick={() => void onCreate()}
          >
            {!createState.isLoading && (
              <WandSparklesIcon className="mr-2" size={16} />
            )}
            {t.buttons.create}
          </FormSpinnerCTA>
        )}
      />
    </PageWithNavigationLayout>
  );
}
