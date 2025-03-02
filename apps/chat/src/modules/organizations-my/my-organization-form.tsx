import type { SdkOrganizationT } from '@llm/sdk';

import { useI18n } from '~/i18n';
import { FormErrorAlert, FormField, Input, SaveButton } from '~/ui';

import { useOrganizationUpdateForm } from '../organizations/form';
import { OrganizationAISettingsFormField } from '../organizations/form/shared/organization-ai-settings-form-field';
import { ProjectFilesListContainer } from '../projects';

type Props = {
  defaultValue: SdkOrganizationT;
};

export function MyOrganizationForm({ defaultValue }: Props) {
  const t = useI18n().pack.organizations.form;
  const { handleSubmitEvent, validator, bind, submitState } = useOrganizationUpdateForm({
    defaultValue,
  });

  return (
    <form
      className="gap-16 grid grid-cols-1 md:grid-cols-[1fr,26rem]"
      onSubmit={handleSubmitEvent}
    >
      <div>
        <FormField
          className="uk-margin"
          label={t.fields.name.label}
          {...validator.errors.extract('name')}
        >
          <Input
            name="name"
            autoComplete="new-name"
            placeholder={t.fields.name.placeholder}
            required
            {...bind.path('name')}
          />
        </FormField>

        <OrganizationAISettingsFormField
          {...validator.errors.extract('aiSettings', { nested: true })}
          {...bind.path('aiSettings')}
        />

        <FormErrorAlert result={submitState.result} />

        <div className="flex flex-row justify-end">
          <SaveButton
            type="submit"
            loading={submitState.loading}
          />
        </div>
      </div>

      <div>
        <h2 className="mb-6 font-semibold text-2xl">
          {t.knowledgeFiles}
        </h2>

        <ProjectFilesListContainer
          projectId={defaultValue.aiSettings.project.id}
          readOnly={false}
        />
      </div>
    </form>
  );
}
