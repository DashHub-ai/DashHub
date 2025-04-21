import type { Task } from 'fp-ts/lib/Task';

import { array as A } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

import type {
  SdkAIExternalAPIEndpointT,
  SdkAIExternalAPIParameterT,
  SdkAIExternalAPISchemaT,
} from '@llm/sdk';

import { concatUrls, isNil, parameterizePath, withSearchParams } from '@llm/commons';

type ExternalApiTask = Task<any>;

type ExternalApiFunctionMap = Record<string, ExternalApiTask>;

/**
 * Creates a map of executable API functions from an external API schema.
 *
 * @param schema The external API schema.
 * @returns An object with function names as keys and executable API functions as values.
 */
export function createAIExternalApiFunctions(schema: SdkAIExternalAPISchemaT): ExternalApiFunctionMap {
  return pipe(
    schema.endpoints,
    A.reduce({} as ExternalApiFunctionMap, (acc, endpoint) => ({
      ...acc,
      [endpoint.functionName]: createApiRequestExecutor({
        context: schema,
        timeout: 3000,
        endpoint,
      }),
    })),
  );
}

/**
 * Groups parameters by their placement (path, query, header, body) and filters out non-required parameters.
 *
 * @param parameters The parameters to group.
 * @returns An object with grouped parameters.
 */
function groupParametersByLocation(parameters: SdkAIExternalAPIParameterT[]) {
  return pipe(
    parameters,
    A.filter(param => !!param.ai?.required),
    A.reduce(
      {
        path: {},
        query: {},
        header: {},
        body: null,
      } as {
        path: Record<string, string>;
        query: Record<string, any>;
        header: Record<string, string>;
        body: Record<string, any> | null;
      },
      (acc, param) => {
        const { value } = param;

        if (isNil(value)) {
          return acc;
        }

        switch (param.placement) {
          case 'path':
            return { ...acc, path: { ...acc.path, [param.name]: String(value) } };

          case 'query':
            return { ...acc, query: { ...acc.query, [param.name]: value } };

          case 'header':
            return { ...acc, header: { ...acc.header, [param.name]: String(value) } };

          case 'body':
            return { ...acc, body: { ...(acc.body || {}), [param.name]: value } };

          default: {
            const _: never = param.placement;

            throw new Error(`Unknown parameter placement: ${param.placement}`);
          }
        }
      },
    ),
  );
}

/**
 * Creates an API request executor function based on the provided endpoint and context.
 *
 * @param options - The options object
 * @param options.timeout - The timeout in milliseconds for the API request
 * @param options.context - The context containing the API URL and other settings
 * @param options.endpoint - The API endpoint configuration
 * @returns A function that executes the API request.
 */
function createApiRequestExecutor(
  {
    timeout,
    context,
    endpoint,
  }: {
    timeout: number;
    context: Omit<SdkAIExternalAPISchemaT, 'endpoints'>;
    endpoint: SdkAIExternalAPIEndpointT;
  },
) {
  const groupedParams = groupParametersByLocation(endpoint.parameters);
  const url = pipe(
    concatUrls(context.apiUrl, endpoint.path),
    parameterizePath(groupedParams.path),
    withSearchParams(groupedParams.query),
  );

  return async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const fetchOptions: RequestInit = {
        method: endpoint.method,
        headers: {
          ...groupedParams.header,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        ...(groupedParams.body && {
          body: JSON.stringify(groupedParams.body),
        }),
        signal: controller.signal,
      };

      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        throw new Error(`Request to ${endpoint.functionName} failed: ${response.status} ${response.statusText}`);
      }

      return response.json();
    }
    catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new Error(`Request to ${endpoint.functionName} timed out after 3 seconds`);
      }
      throw error;
    }
    finally {
      clearTimeout(timeoutId);
    }
  };
}
