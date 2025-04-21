import { controlled } from '@under-control/forms';
import { TrashIcon } from 'lucide-react';

import type { SdkAIExternalAPIParameterT } from '@llm/sdk';

import { Checkbox, Input } from '~/ui';

import { AISchemaParameterDefaultValue } from './ai-schema-parameter-default-value';
import { AISchemaParameterPlacement } from './ai-schema-parameter-placement';
import { AISchemaParameterType } from './ai-schema-parameter-type';

type Props = {
  enforcedConstantValues?: boolean;
  onRemove: VoidFunction;
};

export const AISchemaParameterRow = controlled<SdkAIExternalAPIParameterT, Props>((
  {
    enforcedConstantValues,
    control: { bind, value },
    onRemove,
  },
) => {
  return (
    <tr className="border-gray-200 border-t">
      <td className="px-4 py-2">
        <Input
          {...bind.path('name')}
          required
          placeholder="Parameter name"
        />
      </td>

      <td className="px-4 py-2">
        <AISchemaParameterType
          {...bind.path('type', {
            relatedInputs: ({ newGlobalValue }) => ({
              ...newGlobalValue,
              value: null,
            }),
          })}
          required
        />
      </td>

      <td className="px-4 py-2">
        <AISchemaParameterPlacement
          {...bind.path('placement')}
          required
        />
      </td>

      {!enforcedConstantValues && (
        <>
          <td className="px-4 py-2">
            <Checkbox {...bind.path('ai.generated')} />
          </td>

          <td className="px-4 py-2">
            <Checkbox {...bind.path('ai.required')} />
          </td>
        </>
      )}

      <td className="px-4 py-2">
        <AISchemaParameterDefaultValue
          {...bind.path('value')}
          type={value.type}
        />
      </td>

      <td className="px-4 py-2">
        <Input
          {...bind.path('description')}
          placeholder="Parameter description"
          required
        />
      </td>

      <td className="px-4 py-2 text-right">
        <button
          type="button"
          className="uk-button uk-button-danger uk-button-small"
          onClick={onRemove}
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
});
