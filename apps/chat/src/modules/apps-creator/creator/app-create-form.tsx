import type { SdkCreateAppOutputT } from '@llm/sdk';

import { useI18n } from '~/i18n';
import { useAIExternalAPIDefaultValue } from '~/modules/ai-external-api-creator';
import { AISchemaCreator } from '~/modules/ai-external-api-creator/schema';
import { Checkbox, FormErrorAlert, FormField, SaveButton } from '~/ui';

import { AppSharedFormFields } from '../shared';
import { type CreateAppFormValue, useAppCreateForm } from './use-app-create-form';

type Props = {
  className?: string;
  defaultValue: CreateAppFormValue;
  onAfterSubmit?: (result: SdkCreateAppOutputT) => void;
};

export function AppCreateForm(
  {
    className,
    defaultValue,
    onAfterSubmit,
  }: Props,
) {
  const t = useI18n().pack.appsCreator;

  const externalAPIDefaultValue = useAIExternalAPIDefaultValue();
  const { validator, submitState, bind, value, handleSubmitEvent } = useAppCreateForm({
    defaultValue,
    onAfterSubmit,
  });

  const onToggleExternalAPI = () => {
    bind.path('aiExternalAPI').onChange(
      value.aiExternalAPI
        ? null
        : { schema: externalAPIDefaultValue.schema },
    );
  };

  return (
    <form
      className={className}
      onSubmit={handleSubmitEvent}
    >
      <AppSharedFormFields
        organization={value.organization}
        errors={validator.errors.all as unknown as any}
        {...bind.merged()}
      />

      <FormField
        className="uk-margin"
        label={t.fields.aiExternalAPI.label}
        {...validator.errors.extract('aiExternalAPI')}
      >
        <Checkbox
          value={!!value.aiExternalAPI}
          onChange={onToggleExternalAPI}
        >
          {t.fields.aiExternalAPI.toggle}
        </Checkbox>

        {!!value.aiExternalAPI && (
          <AISchemaCreator
            {...bind.path('aiExternalAPI.schema')}
            {...validator.errors.extract('aiExternalAPI', { nested: true })}
            className="mt-4"
          />
        )}
      </FormField>

      <FormErrorAlert result={submitState.result} />

      <div className="flex flex-row justify-end">
        <SaveButton
          type="submit"
          loading={submitState.loading}
        />
      </div>
    </form>
  );
}
