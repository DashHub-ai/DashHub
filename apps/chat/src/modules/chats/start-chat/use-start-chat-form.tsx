import { useForm } from '@under-control/forms';
import { pipe } from 'fp-ts/lib/function';
import { useLocation } from 'wouter';
import { z } from 'zod';

import { runTask, StrictBooleanV, tapTaskEither, tryOrThrowTE } from '@llm/commons';
import { useAsyncSetter } from '@llm/commons-front';
import {
  SdkCreateMessageInputV,
  type SdkTableRowWithIdNameT,
  SdkTableRowWithIdNameV,
  useSdkForLoggedIn,
} from '@llm/sdk';
import { usePredefinedFormValidators, useSaveErrorNotification } from '@llm/ui';
import { useWorkspaceOrganizationOrThrow } from '~/modules/workspace';
import { useSitemap } from '~/routes';

export const StartChatFormValueV = z
  .object({
    public: StrictBooleanV,
    project: SdkTableRowWithIdNameV.nullable(),
    aiModel: SdkTableRowWithIdNameV,
  })
  .merge(SdkCreateMessageInputV);

export type StartChatFormValueT = z.infer<typeof StartChatFormValueV>;

type FormProps = {
  project: SdkTableRowWithIdNameT | null;
};

export function useStartChatForm({ project }: FormProps) {
  const [, navigate] = useLocation();
  const sitemap = useSitemap();

  const { sdks } = useSdkForLoggedIn();
  const { required, requiredListItem } = usePredefinedFormValidators<StartChatFormValueT>();
  const { organization, assignWorkspaceOrganization } = useWorkspaceOrganizationOrThrow();

  const showErrorNotification = useSaveErrorNotification();
  const onSubmit = (value: StartChatFormValueT) => pipe(
    assignWorkspaceOrganization({
      project: value.project,
      public: value.public,
      internal: false,
    }),
    sdks.dashboard.chats.create,
    tapTaskEither(
      ({ id }) => {
        navigate(
          sitemap.chat.generate({ pathParams: { id } }),
          {
            state: {
              message: value,
            },
          },
        );
      },
      showErrorNotification,
    ),
    runTask,
  );

  const form = useForm({
    resetAfterSubmit: false,
    defaultValue: {
      project,
      content: '',
      aiModel: null as any,
      public: false,
      files: [],
    },
    onSubmit,
    validation: {
      mode: ['blur', 'submit'],
      validators: () => [
        required('content'),
        requiredListItem('aiModel'),
      ],
    },
  });

  const defaultModelSetter = useAsyncSetter(
    {
      fetcher: pipe(sdks.dashboard.aiModels.getDefault(organization.id), tryOrThrowTE),
      setter: (result) => {
        if (form.value.aiModel === null) {
          form.setValue({
            value: {
              aiModel: result,
            },
            merge: true,
          });
        }
      },
    },
  );

  return {
    form,
    submitting: form.submitState.loading,
    loading: defaultModelSetter.setting,
  };
}
