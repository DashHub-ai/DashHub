import { controlled, useFormValidatorMessages, type ValidationErrorsListProps } from '@under-control/forms';

import type { SdkUserT } from '@llm/sdk';

import { Checkbox, FormField, Input } from '@llm/ui';
import { useI18n } from '~/i18n';

type Value = Pick<SdkUserT, 'name' | 'email' | 'active' | 'archiveProtection'>;

type Props = ValidationErrorsListProps<Value>;

export const UserSharedFormFields = controlled<Value, Props>(({ errors, control: { bind } }) => {
  const t = useI18n().pack.modules.users.form;
  const validation = useFormValidatorMessages({ errors });

  return (
    <>
      <FormField
        className="uk-margin"
        label={t.fields.name.label}
        {...validation.extract('email')}
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

        <Checkbox
          name="archiveProtection"
          className="block uk-text-small"
          {...bind.path('archiveProtection')}
        >
          {t.fields.archiveProtection.label}
        </Checkbox>
      </FormField>
    </>
  );
});
