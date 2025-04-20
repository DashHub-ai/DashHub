import { type ControlBindProps, controlled, useFormValidatorMessages, type ValidationErrorsListProps } from '@under-control/forms';

import type {
  SdkPermissionT,
  SdkUpdateAIExternalAPIInputT,
} from '@llm/sdk';

import { useI18n } from '~/i18n';
import { ShareResourceFormGroup } from '~/modules/permissions';
import { FormField, Input, SelectGenericFileInput, TextArea } from '~/ui';

import { AISchemaCreator } from '../schema';

type Value = Pick<
  SdkUpdateAIExternalAPIInputT,
  'name' | 'description' | 'logo' | 'schema'
> & {
  permissions?: SdkPermissionT[] | null;
};

export type AIExternalAPISharedFormFieldsProps =
  & ValidationErrorsListProps<Value>
  & ControlBindProps<Value>;

export const AIExternalAPISharedFormFields = controlled<Value, AIExternalAPISharedFormFieldsProps>(({ errors, control: { bind } }) => {
  const t = useI18n().pack.aiExternalAPIs;
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
          rows={4}
          required
          {...bind.path('description')}
        />
      </FormField>

      <FormField
        className="uk-margin"
        label={t.fields.logo.label}
      >
        <SelectGenericFileInput
          name="logo"
          accept="image/*"
          {...bind.path('logo')}
        />
      </FormField>

      <FormField
        className="uk-margin"
        label={t.fields.permissions.label}
        {...validation.extract('permissions')}
      >
        <ShareResourceFormGroup {...bind.path('permissions', { input: val => val ?? [] })} />
      </FormField>

      <FormField
        className="uk-margin"
        label={t.fields.schema.label}
        {...validation.extract('schema')}
      >
        <AISchemaCreator
          {...bind.path('schema')}
          {...validation.extract('schema', { nested: true })}
        />
      </FormField>
    </>
  );
});
