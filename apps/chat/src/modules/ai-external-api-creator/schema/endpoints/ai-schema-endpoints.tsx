import { controlled } from '@under-control/forms';
import { pipe } from 'fp-ts/lib/function';
import { PlusIcon } from 'lucide-react';
import { v4 } from 'uuid';

import type { SdkAIExternalAPIEndpointT, SdkTableRowUuidT } from '@dashhub/sdk';

import { rejectById } from '@dashhub/commons';
import { useI18n } from '~/i18n';
import { GhostPlaceholder } from '~/modules/shared';

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
          parameters: [
            {
              id: v4(),
              name: 'q',
              ai: {
                required: false,
                generated: true,
              },
              placement: 'query',
              description: '',
              type: 'string',
              value: null,
            },
          ],
        },
      ],
    });
  };

  return (
    <>
      <ol className="empty:hidden mb-4 list-none">
        {value.map((endpoint, index) => (
          <AISchemaEndpoint
            {...bind.path(`[${index}]`)}
            key={endpoint.id}
            onRemove={() => onRemoveEndpoint(endpoint.id)}
          />
        ))}
      </ol>

      {!value.length && (
        <GhostPlaceholder spaced={false}>
          {t.endpoints.empty}
        </GhostPlaceholder>
      )}

      <div className="flex justify-center mt-4">
        <button
          type="button"
          className="uk-button uk-button-primary uk-button-small"
          onClick={onAddEndpoint}
        >
          <PlusIcon className="mr-2 w-4 h-4" />
          {t.endpoint.add}
        </button>
      </div>
    </>
  );
});
