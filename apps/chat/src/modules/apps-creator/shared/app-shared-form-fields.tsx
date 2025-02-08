import { type ControlBindProps, controlled, useFormValidatorMessages, type ValidationErrorsListProps } from '@under-control/forms';

import type {
  SdkPermissionT,
  SdkTableRowWithIdNameT,
  SdkTableRowWithIdT,
  SdkUpdateAppInputT,
} from '@llm/sdk';

import { useI18n } from '~/i18n';
import { AIModelsSearchSelect } from '~/modules/ai-models';
import { AppsCategoriesSearchSelect } from '~/modules/apps-categories';
import { ShareResourceFormGroup } from '~/modules/permissions';
import { FormField, Input, SelectGenericFileInput, TextArea } from '~/ui';

type Value = Pick<
  SdkUpdateAppInputT,
  'name' | 'chatContext' | 'description' | 'logo' | 'category'
> & {
  permissions?: SdkPermissionT[] | null;
  aiModel: SdkTableRowWithIdNameT | null;
};

export type AppSharedFormFieldsProps =
  & ValidationErrorsListProps<Value>
  & ControlBindProps<Value>
  & {
    organization: SdkTableRowWithIdT;
  };

export const AppSharedFormFields = controlled<Value, AppSharedFormFieldsProps>(({ errors, organization, control: { bind } }) => {
  const t = useI18n().pack.appsCreator;
  const validation = useFormValidatorMessages({ errors });

  return (
    <>
      <FormField
        className="uk-margin"
        label={t.fields.category.label}
        {...validation.extract('category')}
      >
        <AppsCategoriesSearchSelect
          key={organization.id}
          {...bind.path('category')}
          required
          filters={{
            archived: false,
            organizationIds: [organization.id],
          }}
        />
      </FormField>

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
        label={t.fields.aiModel.label}
        {...validation.extract('aiModel')}
      >
        <AIModelsSearchSelect {...bind.path('aiModel')} />
      </FormField>

      <FormField
        className="uk-margin"
        label={t.fields.chatContext.label}
        {...validation.extract('name')}
      >
        <TextArea
          name="chat-context"
          placeholder={t.fields.chatContext.placeholder}
          rows={10}
          required
          {...bind.path('chatContext')}
        />
      </FormField>

      <FormField
        className="uk-margin"
        label={t.fields.permissions.label}
        {...validation.extract('permissions')}
      >
        <ShareResourceFormGroup {...bind.path('permissions', { input: val => val ?? [] })} />
      </FormField>
    </>
  );
});
