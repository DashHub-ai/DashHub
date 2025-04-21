import { identity } from 'fp-ts/lib/function';

import type {
  SdkAIExternalAPIEndpointT,
  SdkAIExternalAPIParameterT,
} from '@llm/sdk';

import { isDangerousObjectKey } from '@llm/commons';

export function createEndpointAIFunctionDefinition(endpoint: SdkAIExternalAPIEndpointT) {
  const aiParameters = endpoint.parameters.filter(param => param.ai?.generated === true);

  const { properties, required } = aiParameters.reduce(
    (acc, param) => {
      if (isDangerousObjectKey(param.name) || !param.ai?.generated) {
        return acc;
      }

      return {
        properties: {
          ...acc.properties,
          [param.name]: generateParameterDefinition(param),
        },
        required: param.ai?.required
          ? [...acc.required, param.name]
          : acc.required,
      };
    },
    {
      properties: {},
      required: [] as string[],
    },
  );

  return {
    name: endpoint.functionName,
    description: endpoint.description,
    parameters: {
      type: 'object',
      properties,
      ...(required.length > 0 && { required }),
    },
  };
}

function generateParameterDefinition(param: SdkAIExternalAPIParameterT) {
  const baseDefinition = {
    description: param.description || `Parameter for ${param.name}`,
  };

  switch (param.type) {
    case 'string':
      return { ...baseDefinition, type: 'string' };

    case 'number':
      return { ...baseDefinition, type: 'number' };

    case 'boolean':
      return { ...baseDefinition, type: 'boolean' };

    case 'enum-string':
      return {
        ...baseDefinition,
        type: 'string',
        enum: parseEnumValues(identity, param.value),
      };

    case 'enum-number':
      return {
        ...baseDefinition,
        type: 'number',
        enum: parseEnumValues(Number, param.value),
      };

    default:
      return { ...baseDefinition, type: 'string' };
  }
}

function parseEnumValues<T>(mapper: (value: string) => T, value: any): T[] {
  if (typeof value === 'string') {
    if (value.trim() === '') {
      return [];
    }
    return value.split(',')
      .map(item => item.trim())
      .map(mapper);
  }

  if (Array.isArray(value)) {
    return value.map(item => mapper(String(item)));
  }

  return [];
}
