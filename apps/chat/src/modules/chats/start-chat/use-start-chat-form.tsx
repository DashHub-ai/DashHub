import { useForm } from '@under-control/forms';
import { pipe } from 'fp-ts/lib/function';
import { useLocation } from 'wouter';

import { runTask, tapTaskEither } from '@llm/commons';
import { type SdkTableRowWithIdNameT, useSdkForLoggedIn } from '@llm/sdk';
import { type SelectItem, usePredefinedFormValidators, useSaveErrorNotification } from '@llm/ui';
import { useSitemap } from '~/routes';

type StartChatFormValue = {
  project: SdkTableRowWithIdNameT | null;
  public: boolean;
  message: string;
  model: SelectItem;
};

export function useStartChatForm() {
  const [, navigate] = useLocation();
  const sitemap = useSitemap();

  const { sdks } = useSdkForLoggedIn();
  const { required } = usePredefinedFormValidators<StartChatFormValue>();

  const showErrorNotification = useSaveErrorNotification();
  const onSubmit = (value: StartChatFormValue) => pipe(
    sdks.dashboard.chats.create({
      public: value.public,
    }),
    tapTaskEither(
      ({ id }) => {
        navigate(sitemap.chat.generate({ pathParams: { id } }));
      },
      showErrorNotification,
    ),
    runTask,
  );

  return useForm({
    resetAfterSubmit: false,
    defaultValue: {
      message: '',
      model: { id: 'gpt-4', name: 'GPT-4' },
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
}
