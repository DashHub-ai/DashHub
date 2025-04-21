import type { SdkAIExternalAPIEndpointT, SdkAIExternalAPIParameterT, SdkAIExternalAPISchemaT } from '@llm/sdk';

const DANGEROUS_PROPS = new Set(['__proto__', 'constructor', 'prototype']);

export function convertAIExternalSchemaToAIFunction(app: SdkAIExternalAPISchemaT) {
  return app.endpoints.map(generateEndpointFunction);
}

function generateEndpointFunction(endpoint: SdkAIExternalAPIEndpointT) {
  const aiParameters = endpoint.parameters.filter(param => param.ai?.generated === true);

  const { properties, required } = aiParameters.reduce(
    (acc, param) => {
      if (DANGEROUS_PROPS.has(param.name)) {
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
    description: `Parameter for ${param.name}`,
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
        ...(Array.isArray(param.value) && { enum: [...param.value] }),
      };

    case 'enum-number':
      return {
        ...baseDefinition,
        type: 'number',
        ...(Array.isArray(param.value) && { enum: [...param.value] }),
      };

    default:
      return { ...baseDefinition, type: 'string' };
  }
}
