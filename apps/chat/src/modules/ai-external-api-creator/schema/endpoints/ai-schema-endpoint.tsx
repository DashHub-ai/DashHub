import { controlled } from '@under-control/forms';
import { TrashIcon } from 'lucide-react';

import type { SdkAIExternalAPIEndpointT } from '@dashhub/sdk';

import { useI18n } from '~/i18n';
import { FormField, Input, TextArea } from '~/ui';

import { AISchemaParameters } from '../parameters';
import { AISchemaEndpointMethod } from './ai-schema-endpoint-method';

type Props = {
  onRemove: VoidFunction;
};

export const AISchemaEndpoint = controlled<SdkAIExternalAPIEndpointT, Props>(({ control: { bind }, onRemove }) => {
  const { pack } = useI18n();
  const t = pack.aiExternalAPIs.fields.schema.endpoint;

  return (
    <li className="mb-8 pb-6 border-gray-200 border-b">
      <div className="items-center gap-4 grid grid-cols-[100px_1fr_auto] mb-4">
        <div>
          <FormField label="Method">
            <AISchemaEndpointMethod {...bind.path('method')} required />
          </FormField>
        </div>

        <div>
          <FormField label={t.path.label}>
            <Input
              {...bind.path('path')}
              required
              placeholder={t.path.placeholder}
            />
          </FormField>
        </div>

        <button
          type="button"
          className="self-end uk-button uk-button-danger"
          onClick={onRemove}
        >
          <TrashIcon className="mr-2 w-4 h-4" />
          {pack.buttons.delete}
        </button>
      </div>

      <div className="w-full">
        <FormField label={t.functionName.label}>
          <Input
            {...bind.path('functionName')}
            required
            placeholder={t.functionName.placeholder}
          />
        </FormField>

        <div className="mt-4">
          <FormField label={t.description.label}>
            <TextArea
              {...bind.path('description')}
              required
              rows={2}
              placeholder={t.description.placeholder}
            />
          </FormField>
        </div>
      </div>

      <div className="mt-4">
        <FormField label={t.parameters.label}>
          <AISchemaParameters {...bind.path('parameters', { input: val => val ?? [] })} />
        </FormField>
      </div>
    </li>
  );
});
