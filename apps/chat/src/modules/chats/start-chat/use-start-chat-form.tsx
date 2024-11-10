import { type FormHookAttrs, useForm } from '@under-control/forms';

import type { SdkTableRowWithIdNameT } from '@llm/sdk';

import { type SelectItem, usePredefinedFormValidators } from '@llm/ui';

type StartChatFormValue = {
  project: SdkTableRowWithIdNameT | null;
  public: boolean;
  message: string;
  model: SelectItem;
};

type StartChatFormHookAttrs =
  & Omit<
    FormHookAttrs<StartChatFormValue>,
    'validation' | 'defaultValue'
  >;

export function useStartChatForm(
  {
    onSubmit,
    ...props
  }: StartChatFormHookAttrs,
) {
  const { required } = usePredefinedFormValidators<StartChatFormValue>();

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
    ...props,
  });
}
