import type { SdkAppT } from '@llm/sdk';

import { FormErrorAlert } from '~/ui';

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
      <AppSharedFormFields
        organization={app.organization}
        errors={validator.errors.all as unknown as any}
        {...bind.merged()}
      />

      <FormErrorAlert result={submitState.result} />
    </form>
  );
}
