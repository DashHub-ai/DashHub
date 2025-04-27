import { useMemo } from 'react';
import { v4 } from 'uuid';

import { useWorkspaceOrganizationOrThrow } from '~/modules/workspace';

import type { CreateAIExternalAPIFormValue } from './use-ai-external-api-create-form';

export function useAIExternalAPIDefaultValue() {
  const { assignWorkspaceOrganization } = useWorkspaceOrganizationOrThrow();

  return useMemo(
    () => assignWorkspaceOrganization<Omit<CreateAIExternalAPIFormValue, 'organization'>>({
      name: '',
      description: '',
      permissions: [],
      logo: null,
      schema: {
        apiUrl: 'https://api.example.com',
        endpoints: [
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
                type: 'string',
                description: '',
                value: null,
              },
            ],
          },
        ],
        parameters: [
          {
            id: v4(),
            name: 'Authorization',
            ai: {
              required: true,
              generated: false,
            },
            placement: 'header',
            type: 'string',
            description: '',
            value: null,
          },
        ],
      },
    }),
    [],
  );
}
