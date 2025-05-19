import { controlled, useFormValidatorMessages, type ValidationErrorsListProps } from '@under-control/forms';

import type { SdkOrganizationT, SdkUpsertUserAISettingsInputT } from '@dashhub/sdk';

import { useI18n } from '~/i18n';
import { FormField, Input } from '~/ui';

import { OrganizationAISettingsFormField } from './organization-ai-settings-form-field';

type Value = Pick<SdkOrganizationT, 'name'> & {
  aiSettings: SdkUpsertUserAISettingsInputT;
};

type Props = ValidationErrorsListProps<Value>;

export const OrganizationSharedFormFields = controlled<Value, Props>(({ errors, control: { bind } }) => {
  const t = useI18n().pack.organizations.form;
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
          placeholder={t.fields.name.placeholder}
          required
          {...bind.path('name')}
        />
      </FormField>

      <OrganizationAISettingsFormField
        {...validation.extract('aiSettings', { nested: true })}
        {...bind.path('aiSettings')}
      />
    </>
  );
});
