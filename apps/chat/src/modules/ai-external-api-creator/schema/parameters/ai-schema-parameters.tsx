import { controlled } from '@under-control/forms';
import { pipe } from 'fp-ts/lib/function';
import { PlusIcon } from 'lucide-react';
import { v4 } from 'uuid';

import type { SdkAIExternalAPIParameterT, SdkTableRowUuidT } from '@llm/sdk';

import { rejectById } from '@llm/commons';
import { useI18n } from '~/i18n';
import { GhostPlaceholder } from '~/modules/shared';

import { AISchemaParameterRow } from './ai-schema-parameter-row';

type Props = {
  enforcedConstantValues?: boolean;
};

export const AISchemaParameters = controlled<SdkAIExternalAPIParameterT[], Props>((
  {
    enforcedConstantValues,
    control: { value, bind, setValue },
  },
) => {
  const t = useI18n().pack.aiExternalAPIs.fields.schema;

  const onRemoveParameter = (id: SdkTableRowUuidT) => {
    setValue({
      value: pipe(
        value,
        rejectById(id),
      ),
    });
  };

  const onAddParameter = () => {
    setValue({
      value: [
        ...value,
        {
          id: v4(),
          name: '',
          ai: enforcedConstantValues
            ? null
            : {
                required: false,
                generated: true,
              },
          placement: 'query',
          description: '',
          type: 'string',
          value: null,
        },
      ],
    });
  };

  return (
    <div className="mt-4">
      {value.length > 0 && (
        <div className="uk-table uk-table-divider uk-table-middle uk-table-responsive uk-table-small">
          <table className="w-full">
            <thead className="bg-gray-50 text-gray-700 text-xs uppercase">
              <tr>
                <th scope="col" className="px-6 py-3 w-[150px]">{t.parameter.columns.name}</th>
                <th scope="col" className="px-6 py-3 w-[150px]">{t.parameter.columns.type}</th>
                <th scope="col" className="px-6 py-3 w-[150px]">{t.parameter.columns.placement}</th>
                {!enforcedConstantValues && (
                  <th scope="col" className="px-6 py-3 w-[150px]">{t.parameter.columns.ai}</th>
                )}
                <th scope="col" className="px-6 py-3 w-[150px]">{t.parameter.columns.value}</th>
                <th scope="col" className="px-6 py-3 w-[50px]"></th>
              </tr>
            </thead>
            <tbody>
              {value.map((parameter, index) => (
                <AISchemaParameterRow
                  {...bind.path(`[${index}]`)}
                  key={parameter.id}
                  enforcedConstantValues={enforcedConstantValues}
                  onRemove={() => onRemoveParameter(parameter.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!value.length && (
        <GhostPlaceholder spaced={false}>
          {t.parameters.empty}
        </GhostPlaceholder>
      )}

      <div className="flex justify-center mt-4">
        <button
          type="button"
          className="uk-button uk-button-default uk-button-small"
          onClick={onAddParameter}
        >
          <PlusIcon className="mr-2 w-4 h-4" />
          {t.parameter.add}
        </button>
      </div>
    </div>
  );
});
