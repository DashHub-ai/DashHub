import type { SdkCreateAppOutputT } from '@llm/sdk';

import { FormErrorAlert, SaveButton } from '~/ui';

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
  const { validator, submitState, bind, value, handleSubmitEvent } = useAppCreateForm({
    defaultValue,
    onAfterSubmit,
  });

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
