import {
  controlled,
  useFormValidatorMessages,
  type ValidationErrorsListProps,
} from '@under-control/forms';
import { useMemo } from 'react';

import type { SdkUpdateUserAuthMethodsT } from '@llm/sdk';

import { Checkbox, FormField, Input } from '~/components';
import { genRandomPassword } from '~/helpers';
import { useI18n } from '~/i18n';

type Props = ValidationErrorsListProps<SdkUpdateUserAuthMethodsT>;

export const UserUpdateAuthMethodsFormField = controlled<SdkUpdateUserAuthMethodsT, Props>(({
  errors,
  control: { bind, value, setValue },
}) => {
  const t = useI18n().pack.modules.users.form;
  const validation = useFormValidatorMessages({ errors });

  const hasInitiallyEnabledPassword = useMemo(() => value.password.enabled, []);

  const isResetPassword = 'value' in value.password;
  const onResetPassword = (resetPassword: boolean) => {
    setValue({
      merge: true,
      value: {
        password: {
          enabled: true,
          ...resetPassword ? { value: '' } : {},
        },
      },
    });
  };

  return (
    <>
      <FormField
        className="uk-margin"
        label={t.fields.auth.label}
        showErrorsAfterBlur={false}
      >
        <Checkbox
          {...bind.path('email.enabled')}
          className="block uk-text-small"
        >
          {t.fields.auth.email.label}
        </Checkbox>

        <Checkbox
          className="block uk-text-small"
          {...bind.path('password.enabled', {
            relatedInputs: ({ newGlobalValue, newControlValue }) => ({
              ...newGlobalValue,
              password: {
                enabled: newControlValue,
                ...!hasInitiallyEnabledPassword && {
                  value: genRandomPassword(),
                },
              },
            }),
          })}
        >
          {t.fields.auth.password.label}
        </Checkbox>

        {hasInitiallyEnabledPassword && (
          <Checkbox
            className="block uk-text-small"
            value={isResetPassword}
            onChange={onResetPassword}
          >
            {t.fields.auth.resetPassword.label}
          </Checkbox>
        )}
      </FormField>

      {(isResetPassword || (!hasInitiallyEnabledPassword && value.password.enabled)) && (
        <FormField
          className="uk-margin"
          label={t.fields.auth.password.label}
          {...validation.extract('password.value')}
        >
          <Input
            type="text"
            name="new-text"
            autoComplete="new-password"
            placeholder={t.fields.auth.password.placeholder}
            required
            {...bind.path('password.value')}
          />
        </FormField>
      )}
    </>
  );
});
