import { useForm } from '@under-control/forms';
import { pipe } from 'fp-ts/lib/function';
import { useLocation } from 'wouter';

import { runTask, tapTaskEither, tryOrThrowTE } from '@llm/commons';
import { useAsyncSetter } from '@llm/commons-front';
import {
  createSDKPermissionUserAccessLevel,
  type SdkCreateChatInputT,
  type SdkTableRowWithIdNameT,
  useSdkForLoggedIn,
} from '@llm/sdk';
import { usePredefinedFormValidators } from '~/hooks';
import { useWorkspaceOrganizationOrThrow } from '~/modules/workspace';
import { useSitemap } from '~/routes';
import { useSaveErrorNotification } from '~/ui';

import type { StartChatFormValueT } from './start-chat-form.types';

type FormProps = {
  project: SdkTableRowWithIdNameT | null;
  defaultValue?: Partial<Omit<StartChatFormValueT, 'project'>>;
};

export function useStartChatForm({ project, defaultValue }: FormProps) {
  const [, navigate] = useLocation();
  const sitemap = useSitemap();

  const { sdks, session } = useSdkForLoggedIn();
  const { required, requiredListItem } = usePredefinedFormValidators<StartChatFormValueT>();
  const { organization, assignWorkspaceOrganization } = useWorkspaceOrganizationOrThrow();

  const showErrorNotification = useSaveErrorNotification();
  const onSubmit = (value: StartChatFormValueT) => pipe(
    assignWorkspaceOrganization<SdkCreateChatInputT>({
      project: value.project,
      internal: false,
      permissions: (
        value.public
          ? []
          : [
              createSDKPermissionUserAccessLevel('write', session.token.sub),
            ]
      ),
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
      ...defaultValue,
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
