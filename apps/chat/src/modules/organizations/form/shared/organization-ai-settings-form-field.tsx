import { controlled, useFormValidatorMessages, type ValidationErrorsListProps } from '@under-control/forms';

import type { SdkUpsertOrganizationAISettingsInputT } from '@dashhub/sdk';

import { useI18n } from '~/i18n';
import { FormField, TextArea } from '~/ui';

type Value = SdkUpsertOrganizationAISettingsInputT;

type Props = ValidationErrorsListProps<Value>;

export const OrganizationAISettingsFormField = controlled<Value, Props>(({ errors, control: { bind } }) => {
  const t = useI18n().pack.organizations.form;
  const validation = useFormValidatorMessages({ errors });

  return (
    <>
      <FormField
        className="uk-margin"
        label={t.fields.aiSettings.chatContext.label}
        {...validation.extract('chatContext')}
      >
        <TextArea
          name="chat-context"
          placeholder={t.fields.aiSettings.chatContext.placeholder}
          rows={10}
          {...bind.path('chatContext')}
        />
      </FormField>
    </>
  );
});
