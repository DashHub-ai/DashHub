import type { SdkAIExternalApiT } from '@dashhub/sdk';

import { FormErrorAlert, SaveButton } from '~/ui';

import { AIExternalAPISharedFormFields } from '../shared';
import { useAIExternalAPIUpdateForm } from './use-ai-external-api-update-form';

type Props = {
  className?: string;
  api: SdkAIExternalApiT;
  onAfterSubmit?: VoidFunction;
};

export function AIExternalAPIUpdateForm(
  {
    className,
    api,
    onAfterSubmit,
  }: Props,
) {
  const { handleSubmitEvent, validator, submitState, bind } = useAIExternalAPIUpdateForm({
    defaultValue: {
      ...api,
      permissions: api.permissions?.current ?? [],
    },
    onAfterSubmit,
  });

  return (
    <form
      className={className}
      onSubmit={handleSubmitEvent}
    >
      <AIExternalAPISharedFormFields
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
