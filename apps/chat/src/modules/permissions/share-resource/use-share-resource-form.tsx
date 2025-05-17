import { type FormHookAttrs, useForm } from '@under-control/forms';

import type { SdkPermissionT } from '@dashhub/sdk';

type ShareResourceFormHookAttrs = Omit<
  FormHookAttrs<SdkPermissionT[]>,
  'validation'
>;

export function useShareResourceForm(props: ShareResourceFormHookAttrs) {
  return useForm({
    resetAfterSubmit: false,
    validation: {
      mode: ['blur', 'submit'],
    },
    ...props,
  });
}
