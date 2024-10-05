import { type FormHookAttrs, useForm } from '@under-control/forms';

import type { SdkCreateOrganizationInputT } from '@llm/sdk';

import { usePredefinedFormValidators } from '~/hooks';

type CreateOrganizationFormHookAttrs = Omit<
  FormHookAttrs<SdkCreateOrganizationInputT>,
  'validation' | 'onSubmit'
> & {
  onAfterSubmit?: VoidFunction;
};

export function useOrganizationCreateForm(
  {
    onAfterSubmit,
    ...props
  }: CreateOrganizationFormHookAttrs,
) {
  const { required } = usePredefinedFormValidators<SdkCreateOrganizationInputT>();
  const onSubmit = async (data: SdkCreateOrganizationInputT) => {
    // eslint-disable-next-line no-console
    console.info(data);
    onAfterSubmit?.();
  };

  return useForm({
    resetAfterSubmit: false,
    onSubmit,
    validation: {
      mode: ['blur', 'submit'],
      validators: () => [
        required('name'),
      ],
    },
    ...props,
  });
}
