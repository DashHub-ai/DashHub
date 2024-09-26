import type { ControlValue } from '@under-control/forms';

import {
  useEmailValidatorFormValidators,
  useRequiredFormValidators,
} from '@llm/commons-front';
import { useI18n } from '~/i18n';

export function usePredefinedFormValidators<V extends ControlValue>() {
  const { validation } = useI18n().pack;

  return {
    ...useRequiredFormValidators<V>({
      messages: validation,
    }),
    ...useEmailValidatorFormValidators<V>({
      messages: validation,
    }),
  };
};
