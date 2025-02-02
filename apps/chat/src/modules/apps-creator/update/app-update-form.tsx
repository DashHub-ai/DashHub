import type { SdkAppT } from '@llm/sdk';

import { useI18n } from '~/i18n';
import { ProjectFilesListContainer } from '~/modules/projects';
import { FormErrorAlert, SaveButton } from '~/ui';

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
  const t = useI18n().pack.appsCreator.files;
  const { handleSubmitEvent, validator, submitState, bind } = useAppUpdateForm({
    defaultValue: {
      ...app,
      permissions: app.permissions?.current ?? [],
    },
    onAfterSubmit,
  });

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

          <div className="flex flex-row justify-end">
            <SaveButton
              type="submit"
              loading={submitState.loading}
            />
          </div>
        </div>

        <div>
          <h2 className="mb-6 font-semibold text-2xl">
            {t.title}
          </h2>

          <ProjectFilesListContainer projectId={app.project.id} />
        </div>
      </div>
    </form>
  );
}
