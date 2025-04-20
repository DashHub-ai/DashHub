import { controlled } from '@under-control/forms';
import { TrashIcon } from 'lucide-react';

import type { SdkAIExternalAPIEndpointT } from '@llm/sdk';

import { useI18n } from '~/i18n';
import { FormField, Input, TextArea } from '~/ui';

import { AISchemaEndpointMethod } from './ai-schema-endpoint-method';

type Props = {
  onRemove: VoidFunction;
};

export const AISchemaEndpoint = controlled<SdkAIExternalAPIEndpointT, Props>(({ control: { bind }, onRemove }) => {
  const { pack } = useI18n();

  return (
    <li className="mb-8 pb-6 border-gray-200 border-b">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-1/4">
          <FormField label="Method">
            <AISchemaEndpointMethod {...bind.path('method')} required />
          </FormField>
        </div>

        <div className="w-3/4">
          <FormField label="Path">
            <Input
              {...bind.path('path')}
              required
              placeholder="Path only (e.g., /api/resource), not full URL"
            />
          </FormField>
        </div>
      </div>

      <div className="w-full">
        <FormField label="Function Name">
          <Input
            {...bind.path('functionName')}
            required
            placeholder="Name of the function (e.g., getUserData)"
          />
        </FormField>

        <div className="mt-4">
          <FormField label="Description">
            <TextArea
              {...bind.path('description')}
              required
              rows={2}
              placeholder="Describe what this endpoint does and what information it provides"
            />
          </FormField>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button
          type="button"
          className="uk-button uk-button-danger"
          onClick={onRemove}
        >
          <TrashIcon className="mr-2 w-4 h-4" />
          {pack.buttons.delete}
        </button>
      </div>
    </li>
  );
});
