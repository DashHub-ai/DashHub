import { controlled, useFormValidatorMessages, type ValidationErrorsListProps } from '@under-control/forms';

import type { SdkCreateAppCategoryInputT, SdkTableRowIdT, SdkTableRowWithIdT } from '@llm/sdk';

import { FormField, Input, TextArea } from '@llm/ui';
import { useI18n } from '~/i18n';

import { AppsCategoriesSearchSelect } from '../../controls';

type Value = Pick<SdkCreateAppCategoryInputT, 'name' | 'description' | 'parentCategory'>;

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
          filters={{
            archived: false,
            organizationIds: [organization.id],
            excludeIds: excludeParentCategoriesIds || [],
          }}
          required
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
          required
          {...bind.path('description')}
        />
      </FormField>
    </>
  );
});
