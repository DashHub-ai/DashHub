import { useForm } from '@under-control/forms';
import { pipe } from 'fp-ts/lib/function';
import { useLocation } from 'wouter';

import { runTask, tapTaskEither, tryOrThrowTE } from '@llm/commons';
import { useAsyncSetter } from '@llm/commons-front';
import { type SdkTableRowWithIdNameT, useSdkForLoggedIn } from '@llm/sdk';
import { usePredefinedFormValidators, useSaveErrorNotification } from '@llm/ui';
import { useWorkspaceOrganizationOrThrow } from '~/modules/workspace';
import { useSitemap } from '~/routes';

type StartChatFormValue = {
  project: SdkTableRowWithIdNameT | null;
  public: boolean;
  message: string;
  model: SdkTableRowWithIdNameT | null;
};

export function useStartChatForm() {
  const [, navigate] = useLocation();
  const sitemap = useSitemap();

  const { sdks } = useSdkForLoggedIn();
  const { required } = usePredefinedFormValidators<StartChatFormValue>();
  const { organization, assignWorkspaceOrganization } = useWorkspaceOrganizationOrThrow();

  const showErrorNotification = useSaveErrorNotification();
  const onSubmit = (value: StartChatFormValue) => pipe(
    assignWorkspaceOrganization({
      public: value.public,
    }),
    sdks.dashboard.chats.create,
    tapTaskEither(
      ({ id }) => {
        navigate(sitemap.chat.generate({ pathParams: { id } }));
      },
      showErrorNotification,
    ),
    runTask,
  );

  const form = useForm({
    resetAfterSubmit: false,
    defaultValue: {
      message: '',
      model: null,
      project: null,
      public: false,
    },
    onSubmit,
    validation: {
      mode: ['blur', 'submit'],
      validators: () => [
        required('message'),
      ],
    },
  });

  const defaultModelSetter = useAsyncSetter(
    {
      fetcher: pipe(sdks.dashboard.aiModels.getDefault(organization.id), tryOrThrowTE),
      setter: (result) => {
        if (form.value.model === null) {
          form.setValue({
            value: {
              model: result,
            },
            merge: true,
          });
        }
      },
    },
  );

  return {
    form,
    loading: defaultModelSetter.setting,
  };
}
