import { controlled } from '@under-control/forms';
import { pipe } from 'fp-ts/lib/function';
import { PlusIcon } from 'lucide-react';
import { v4 } from 'uuid';

import type { SdkAIExternalAPIEndpointT, SdkTableRowUuidT } from '@llm/sdk';

import { rejectById } from '@llm/commons';
import { useI18n } from '~/i18n';

import { AISchemaEndpoint } from './ai-schema-endpoint';

export const AISchemaEndpoints = controlled<SdkAIExternalAPIEndpointT[]>(({ control: { value, bind, setValue } }) => {
  const t = useI18n().pack.aiExternalAPIs.fields.schema;

  const onRemoveEndpoint = (id: SdkTableRowUuidT) => {
    setValue({
      value: pipe(
        value,
        rejectById(id),
      ),
    });
  };

  const onAddEndpoint = () => {
    setValue({
      value: [
        ...value,
        {
          id: v4(),
          method: 'GET',
          functionName: '',
          description: '',
          path: '',
          parameters: [],
        },
      ],
    });
  };

  return (
    <>
      <div className="flex justify-start">
        <button
          type="button"
          className="uk-button uk-button-default uk-button-small"
          onClick={onAddEndpoint}
        >
          <PlusIcon className="mr-2 w-4 h-4" />
          {t.endpoint.add}
        </button>
      </div>

      {value.length > 0 && (
        <div className="my-8 border-gray-200 border-t border-dashed" />
      )}

      <ol className="list-none">
        {value.map((endpoint, index) => (
          <AISchemaEndpoint
            {...bind.path(`[${index}]`)}
            key={endpoint.id}
            onRemove={() => onRemoveEndpoint(endpoint.id)}
          />
        ))}
      </ol>
    </>
  );
});
