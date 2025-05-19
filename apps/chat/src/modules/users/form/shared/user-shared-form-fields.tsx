import { controlled, useFormValidatorMessages, type ValidationErrorsListProps } from '@under-control/forms';

import type { SdkOptionalFileUploadT, SdkUserT } from '@dashhub/sdk';

import { useI18n } from '~/i18n';
import { Checkbox, FormField, Input, SelectGenericFileInput } from '~/ui';

type Value = Pick<SdkUserT, 'name' | 'email' | 'active' | 'role'> & {
  avatar?: SdkOptionalFileUploadT;
};

type Props = ValidationErrorsListProps<Value>;

export const UserSharedFormFields = controlled<Value, Props>(({ errors, control: { bind, value } }) => {
  const t = useI18n().pack.users.form;
  const validation = useFormValidatorMessages({ errors });

  return (
    <>
      <FormField
        className="uk-margin"
        label={t.fields.name.label}
        {...validation.extract('name')}
      >
        <Input
          name="name"
          autoComplete="new-name"
          placeholder={t.fields.name.placeholder}
          required
          {...bind.path('name')}
        />
      </FormField>

      <FormField
        className="uk-margin"
        label={t.fields.email.label}
        {...validation.extract('email')}
      >
        <Input
          name="email"
          autoComplete="new-email"
          placeholder={t.fields.email.placeholder}
          required
          {...bind.path('email')}
        />
      </FormField>

      {value.role !== 'root' && (
        <FormField
          className="uk-margin"
          label={t.fields.avatar.label}
        >
          <SelectGenericFileInput
            name="avatar"
            accept="image/*"
            {...bind.path('avatar')}
          />
        </FormField>
      )}

      <FormField
        className="uk-margin"
        label={t.fields.flags.label}
      >
        <Checkbox
          name="active"
          className="block uk-text-small"
          {...bind.path('active')}
        >
          {t.fields.active.label}
        </Checkbox>
      </FormField>
    </>
  );
});
