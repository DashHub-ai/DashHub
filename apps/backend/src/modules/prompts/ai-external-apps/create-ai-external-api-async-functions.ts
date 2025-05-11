import { array as A, record as R } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

import type {
  SdkAIExternalAPIEndpointT,
  SdkAIExternalAPIParameterT,
  SdkAIExternalAPISchemaT,
} from '@dashhub/sdk';
import type { AIProxyAsyncFunction } from '~/modules/ai-connector/clients';
import type { TableId } from '~/modules/database';

import {
  concatUrls,
  isDangerousObjectKey,
  isNil,
  parameterizePath,
  withSearchParams,
} from '@dashhub/commons';
import { LoggerService } from '~/modules/logger';

import { createExternalAIEndpointFunctionDefinition } from './create-ai-endpoint-function-definition';

/**
 * Creates a map of executable API functions from an external API schema.
 */
export function createAIExternalApiAsyncFunctions(
  {
    id,
    schema,
  }: {
    id: TableId;
    schema: SdkAIExternalAPISchemaT;
  },
): AIProxyAsyncFunction[] {
  return pipe(
    schema.endpoints,
    A.map((endpoint): AIProxyAsyncFunction => ({
      externalApi: {
        id,
        endpoint,
      },
      definition: createExternalAIEndpointFunctionDefinition(endpoint),
      executor: createApiRequestExecutor({
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
  const logger = LoggerService.of('createApiRequestExecutor');

  // Pre-create parameter definitions map for lookup efficiency
  const paramDefinitions = pipe(
    endpoint.parameters,
    A.reduce({} as Record<string, SdkAIExternalAPIParameterT>, (acc, param) => ({
      ...acc,
      [param.name]: param,
    })),
  );

  return async (dynamicAIArgs: Record<string, any>) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      // Process all parameters and prepare request configuration
      const requestConfig = prepareRequestConfiguration({
        dynamicAIArgs,
        context,
        endpoint,
        paramDefinitions,
        logger,
      });

      // Build URL with path params and query string
      const url = pipe(
        concatUrls(context.apiUrl, endpoint.path),
        parameterizePath(requestConfig.path),
        withSearchParams(requestConfig.query),
      );

      // Prepare fetch options
      const fetchOptions: RequestInit = buildFetchOptions({
        requestConfig,
        method: endpoint.method,
        controller,
      });

      logger.info('Executing API request', {
        url,
        method: endpoint.method,
        headers: fetchOptions.headers,
        body: fetchOptions.body,
        dynamicAIArgs,
      });

      return await executeRequest({
        url,
        fetchOptions,
        functionName: endpoint.functionName,
        logger,
      });
    }
    catch (error) {
      handleRequestError({
        error,
        functionName: endpoint.functionName,
        timeout,
        logger,
      });
      throw error; // Re-throw after logging
    }
    finally {
      clearTimeout(timeoutId);
    }
  };
}

/**
 * Processes and combines static and dynamic parameters for an API request
 */
function prepareRequestConfiguration(
  {
    dynamicAIArgs,
    context,
    endpoint,
    paramDefinitions,
    logger,
  }: {
    dynamicAIArgs: Record<string, any>;
    context: Omit<SdkAIExternalAPISchemaT, 'endpoints'>;
    endpoint: SdkAIExternalAPIEndpointT;
    paramDefinitions: Record<string, SdkAIExternalAPIParameterT>;
    logger: ReturnType<typeof LoggerService.of>;
  },
) {
  // Start with static/required parameters from the schema
  const requestParams = groupParametersByLocation([
    ...context.parameters,
    ...endpoint.parameters,
  ]);

  // Process dynamic arguments from the AI
  pipe(
    dynamicAIArgs,
    R.mapWithIndex((argName, argValue) => {
      const paramDef = paramDefinitions[argName];

      if (isNil(argValue) || !paramDef) {
        if (!paramDef) {
          logger.warn(`Argument '${argName}' provided by AI but not found in endpoint definition. Skipping.`);
        }
        return;
      }

      applyParameterToRequest({
        placement: paramDef.placement,
        name: argName,
        value: argValue,
        requestParams,
        logger,
      });
    }),
  );

  return requestParams;
}

/**
 * Applies a parameter to the appropriate section of the request configuration
 */
function applyParameterToRequest(
  {
    placement,
    name,
    value,
    requestParams,
    logger,
  }: {
    placement: SdkAIExternalAPIParameterT['placement'];
    name: string;
    value: any;
    requestParams: ReturnType<typeof groupParametersByLocation>;
    logger: ReturnType<typeof LoggerService.of>;
  },
) {
  if (isDangerousObjectKey(name)) {
    logger.warn(`Skipping dangerous object key: ${name}`);
    return;
  }

  switch (placement) {
    case 'path':
      requestParams.path[name] = String(value);
      break;

    case 'query':
      requestParams.query[name] = value;
      break;

    case 'header':
      requestParams.header[name] = String(value);
      break;

    case 'body':
      requestParams.body = { ...(requestParams.body || {}), [name]: value };
      break;

    default: {
      const _: never = placement;
      logger.error(`Unknown parameter placement: ${placement} for argument ${name}`);
    }
  }
}

/**
 * Builds fetch options object from request configuration
 */
function buildFetchOptions(
  {
    requestConfig,
    method,
    controller,
  }: {
    requestConfig: ReturnType<typeof groupParametersByLocation>;
    method: string;
    controller: AbortController;
  },
): RequestInit {
  return {
    method,
    headers: {
      ...requestConfig.header,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    ...(requestConfig.body && {
      body: JSON.stringify(requestConfig.body),
    }),
    signal: controller.signal,
  };
}

/**
 * Executes the fetch request and processes the response
 */
async function executeRequest(
  {
    url,
    fetchOptions,
    functionName,
    logger,
  }: {
    url: string;
    fetchOptions: RequestInit;
    functionName: string;
    logger: ReturnType<typeof LoggerService.of>;
  },
) {
  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    const errorBody = await response.text();

    logger.error(`Request to ${functionName} failed`, {
      status: response.status,
      statusText: response.statusText,
      body: errorBody,
    });

    throw new Error(`Request to ${functionName} failed: ${response.status} ${response.statusText}. Body: ${errorBody}`);
  }

  // Handle cases where the response might be empty or not JSON
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  else {
    const textResponse = await response.text();
    logger.info(`Request to ${functionName} returned non-JSON response`, { contentType, textResponse });
    return { response: textResponse };
  }
}

/**
 * Handles request errors with appropriate logging
 */
function handleRequestError(
  {
    error,
    functionName,
    timeout,
    logger,
  }: {
    error: unknown;
    functionName: string;
    timeout: number;
    logger: ReturnType<typeof LoggerService.of>;
  },
) {
  if (error instanceof DOMException && error.name === 'AbortError') {
    logger.error(`Request to ${functionName} timed out after ${timeout}ms`);
    throw new Error(`Request to ${functionName} timed out after ${timeout / 1000} seconds`);
  }

  logger.error(`Error during request to ${functionName}:`, error);
}
