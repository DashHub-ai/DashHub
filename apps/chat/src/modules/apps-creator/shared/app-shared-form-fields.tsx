import { type ControlBindProps, controlled, useFormValidatorMessages, type ValidationErrorsListProps } from '@under-control/forms';

import type { SdkTableRowWithIdT, SdkUpdateAppInputT } from '@llm/sdk';

import { FormField, Input, TextArea } from '@llm/ui';
import { useI18n } from '~/i18n';
import { AppsCategoriesSearchSelect } from '~/modules/apps-categories';

type Value = Pick<
  SdkUpdateAppInputT,
  'name' | 'chatContext' | 'description' | 'category'
>;

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
    </>
  );
});
