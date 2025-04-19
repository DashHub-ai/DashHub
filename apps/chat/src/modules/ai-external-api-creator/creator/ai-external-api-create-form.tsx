import type { SdkCreateAIExternalAPIOutputT } from '@llm/sdk';

import { FormErrorAlert, SaveButton } from '~/ui';

import { AIExternalAPISharedFormFields } from '../shared';
import { type CreateAIExternalAPIFormValue, useAIExternalAPICreateForm } from './use-ai-external-api-create-form';

type Props = {
  className?: string;
  defaultValue: CreateAIExternalAPIFormValue;
  onAfterSubmit?: (result: SdkCreateAIExternalAPIOutputT) => void;
};

export function AIExternalAPICreateForm(
  {
    className,
    defaultValue,
    onAfterSubmit,
  }: Props,
) {
  const { validator, submitState, bind, handleSubmitEvent } = useAIExternalAPICreateForm({
    defaultValue,
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
