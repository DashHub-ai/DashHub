import { controlled, useFormValidatorMessages, type ValidationErrorsListProps } from '@under-control/forms';

import type { SdkAppT } from '@llm/sdk';

import { FormField, Input, TextArea } from '@llm/ui';
import { useI18n } from '~/i18n';

type Value = Pick<SdkAppT, 'name' | 'chatContext' | 'description'>;

type Props = ValidationErrorsListProps<Value>;

export const AppSharedFormFields = controlled<Value, Props>(({ errors, control: { bind } }) => {
  const t = useI18n().pack.modules.apps.form;
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

      <FormField
        className="uk-margin"
        label={t.fields.description.label}
        {...validation.extract('description')}
      >
        <TextArea
          name="description"
          placeholder={t.fields.description.placeholder}
          required
          {...bind.path('description')}
        />
      </FormField>

      <FormField
        className="uk-margin"
        label={t.fields.chatContext.label}
        {...validation.extract('name')}
      >
        <TextArea
          name="chat-context"
          placeholder={t.fields.chatContext.placeholder}
          rows={3}
          required
          {...bind.path('chatContext')}
        />
      </FormField>
    </>
  );
});
