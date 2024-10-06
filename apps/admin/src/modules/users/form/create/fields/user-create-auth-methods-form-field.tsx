import {
  controlled,
  useFormValidatorMessages,
  type ValidationErrorsListProps,
} from '@under-control/forms';

import type { SdkCreateUserAuthMethodsT } from '@llm/sdk';

import { Checkbox, FormField, Input } from '~/components';
import { genRandomPassword } from '~/helpers';
import { useI18n } from '~/i18n';

type Props = ValidationErrorsListProps<SdkCreateUserAuthMethodsT>;

export const UserCreateAuthMethodsFormField = controlled<SdkCreateUserAuthMethodsT, Props>(({
  errors,
  control: { bind, value },
}) => {
  const t = useI18n().pack.modules.users.form;
  const validation = useFormValidatorMessages({ errors });

  const isPasswordLoginEnabled = typeof value.password?.value === 'string';
  const onTogglePassword = (passwordEnabled: boolean) => {
    if (passwordEnabled) {
      bind.path('password.value').onChange(
        genRandomPassword(),
      );
    }
    else {
      bind.path('password').onChange(null);
    }
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
          value={isPasswordLoginEnabled}
          onChange={onTogglePassword}
        >
          {t.fields.auth.password.label}
        </Checkbox>
      </FormField>

      {isPasswordLoginEnabled && (
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
