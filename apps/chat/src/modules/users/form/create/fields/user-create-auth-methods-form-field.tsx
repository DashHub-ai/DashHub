import {
  controlled,
  useFormValidatorMessages,
  type ValidationErrorsListProps,
} from '@under-control/forms';

import type { SdkCreateUserAuthMethodsT } from '@llm/sdk';

import { genRandomPassword } from '@llm/commons';
import { useI18n } from '~/i18n';
import { Checkbox, FormField, Input } from '~/ui';

type Props = ValidationErrorsListProps<SdkCreateUserAuthMethodsT>;

export const UserCreateAuthMethodsFormField = controlled<SdkCreateUserAuthMethodsT, Props>(({
  errors,
  control: { bind, value, setValue },
}) => {
  const t = useI18n().pack.users.form;
  const validation = useFormValidatorMessages({ errors });

  const onTogglePassword = (passwordEnabled: boolean) => {
    setValue({
      merge: true,
      value: {
        password: passwordEnabled
          ? {
              enabled: true,
              value: genRandomPassword(),
            }
          : { enabled: false },
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
          value={value.password.enabled}
          onChange={onTogglePassword}
        >
          {t.fields.auth.password.label}
        </Checkbox>
      </FormField>

      {value.password.enabled && (
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
