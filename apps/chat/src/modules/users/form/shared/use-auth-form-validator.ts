import {
  type ControlValue,
  error,
  type GetAllObjectPaths,
  type GetAllObjectPathsEntries,
  type PathValidator,
} from '@under-control/forms';

import { format } from '@dashhub/commons';
import { SDK_MIN_PASSWORD_LENGTH, type SdkCreateUserAuthMethodsT } from '@dashhub/sdk';
import { useI18n } from '~/i18n';

type AllAuthObjectPaths<V extends ControlValue> = Extract<GetAllObjectPathsEntries<V>, {
  type: {
    password: {
      enabled: boolean;
      value?: string | null;
    };
  };
}>['path'];

export function useUseAuthFormValidator<V extends ControlValue>() {
  const t = useI18n().pack.validation.password;

  return <P extends GetAllObjectPaths<V> & AllAuthObjectPaths<V>>(path: P): PathValidator<V, P> => ({
    path,
    fn: ({ value }) => {
      const castedValue = value as SdkCreateUserAuthMethodsT;

      if (
        castedValue.password
        && 'value' in castedValue.password
        && castedValue.password.value.length < SDK_MIN_PASSWORD_LENGTH
      ) {
        return error(
          format(t.mustBeLongerThan, { number: SDK_MIN_PASSWORD_LENGTH }),
          null,
          `${path}.password.value`,
        );
      }
    },
  });
}
