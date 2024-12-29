import { controlled, useFormValidatorMessages, type ValidationErrorsListProps } from '@under-control/forms';

import type { SdkUpdateProjectInputT } from '@llm/sdk';

import { Checkbox, FormField, Input, TextArea } from '@llm/ui';
import { useI18n } from '~/i18n';

type Value = Pick<SdkUpdateProjectInputT, 'name' | 'summary'>;

type Props = ValidationErrorsListProps<Value>;

export const ProjectSharedFormFields = controlled<Value, Props>(({ errors, control: { bind, value } }) => {
  const t = useI18n().pack.projects.form;
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
        {...validation.extract('summary.content.value')}
      >
        <TextArea
          name="description"
          placeholder={t.fields.description.placeholder}
          {...bind.path('summary.content.value', { input: value => value ?? '' })}
          disabled={value.summary.content.generated}
        />

        <Checkbox
          className="block pt-2 uk-text-small"
          {...bind.path('summary.content.generated', {
            relatedInputs: ({ newGlobalValue, newControlValue }) => ({
              ...newGlobalValue,
              summary: {
                ...newGlobalValue.summary,
                content: (
                  newControlValue
                    ? { generated: true, value: null }
                    : { generated: false, value: '' }
                ),
              },
            }),
          })}
        >
          {t.fields.description.generated}
        </Checkbox>
      </FormField>
    </>
  );
});
