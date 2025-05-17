import clsx from 'clsx';

import type { SdkAppT } from '@dashhub/sdk';

import { useI18n } from '~/i18n';
import { useAIExternalAPIDefaultValue } from '~/modules/ai-external-api-creator';
import { AISchemaCreator } from '~/modules/ai-external-api-creator/schema';
import { ProjectFilesListContainer } from '~/modules/projects';
import { Checkbox, FormErrorAlert, FormField, SaveButton } from '~/ui';

import { AppSharedFormFields } from '../shared';
import { useAppUpdateForm } from './use-app-update-form';

type Props = {
  className?: string;
  app: SdkAppT;
  onAfterSubmit?: VoidFunction;
};

export function AppUpdateForm(
  {
    className,
    app,
    onAfterSubmit,
  }: Props,
) {
  const t = useI18n().pack.appsCreator;
  const { handleSubmitEvent, validator, submitState, bind, value } = useAppUpdateForm({
    defaultValue: {
      ...app,
      permissions: app.permissions?.current ?? [],
    },
    onAfterSubmit,
  });

  const externalAPIDefaultValue = useAIExternalAPIDefaultValue();

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
      <div className="gap-16 grid grid-cols-1 md:grid-cols-[1fr,26rem]">
        <div>
          <AppSharedFormFields
            organization={app.organization}
            errors={validator.errors.all as unknown as any}
            {...bind.merged()}
          />

          <FormErrorAlert result={submitState.result} />
        </div>

        <div>
          <h2 className="mb-6 font-semibold text-2xl">
            {t.files.title}
          </h2>

          <ProjectFilesListContainer projectId={app.project.id} />
        </div>
      </div>

      <FormField
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

      <div
        className={clsx(
          'flex justify-end mt-6',
          !value.aiExternalAPI && 'md:w-[calc(100%-26rem-4rem)]',
        )}
      >
        <SaveButton
          type="submit"
          loading={submitState.loading}
        />
      </div>
    </form>
  );
}
