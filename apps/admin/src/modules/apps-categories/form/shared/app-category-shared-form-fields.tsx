import { controlled, useFormValidatorMessages, type ValidationErrorsListProps } from '@under-control/forms';

import type { SdkCreateAppCategoryInputT, SdkTableRowIdT, SdkTableRowWithIdT } from '@llm/sdk';

import { FormField, Input, TextArea } from '@llm/ui';
import { useI18n } from '~/i18n';

import { AppsCategoriesSearchSelect } from '../../controls';

type Value = Pick<
  SdkCreateAppCategoryInputT,
  'name' | 'description' | 'parentCategory' | 'icon'
>;

type Props =
  & ValidationErrorsListProps<Value>
  & {
    organization: SdkTableRowWithIdT;
    excludeParentCategoriesIds?: SdkTableRowIdT[];
  };

export const AppCategorySharedFormFields = controlled<Value, Props>(({
  errors,
  organization,
  excludeParentCategoriesIds,
  control: { bind },
}) => {
  const t = useI18n().pack.modules.appsCategories.form;
  const validation = useFormValidatorMessages({ errors });

  return (
    <>
      <FormField
        className="uk-margin"
        label={t.fields.parentCategory.label}
        {...validation.extract('parentCategory')}
      >
        <AppsCategoriesSearchSelect
          {...bind.path('parentCategory')}
          key={organization.id}
          filters={{
            archived: false,
            organizationIds: [organization.id],
            excludeIds: excludeParentCategoriesIds || [],
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
        label={t.fields.icon.label}
        {...validation.extract('name')}
      >
        <Input
          name="icon"
          placeholder={t.fields.icon.placeholder}
          required
          {...bind.path('icon')}
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
          {...bind.path('description')}
        />
      </FormField>
    </>
  );
});
