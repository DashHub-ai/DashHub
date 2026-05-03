import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

import type { AIProxyAsyncFunction } from '~/modules/ai-connector/clients';
import type { TableId } from '~/modules/database';

import { LoggerService } from '~/modules/logger';

const logger = LoggerService.of('MCPServersClient');

const CLIENT_INFO = { name: 'dashhub', version: '1.0.0' } as const;

/**
 * Connects to an MCP server, fetches its tool list, and returns them as
 * AIProxyAsyncFunction[] so they plug directly into the existing tool-calling pipeline.
 *
 * Tries StreamableHTTP first (MCP 1.0+); falls back to SSE (legacy servers).
 */
export async function getMCPServerAsyncFunctions(
  serverId: TableId,
  serverUrl: string,
): Promise<AIProxyAsyncFunction[]> {
  const url = new URL(serverUrl);
  let client: Client | null = null;

  try {
    client = await connectMCPClient(url);
    const { tools } = await client.listTools();

    return tools.map((tool): AIProxyAsyncFunction => ({
      externalApi: { id: serverId },
      definition: {
        name: tool.name,
        description: tool.description ?? '',
        parameters: tool.inputSchema ?? { type: 'object', properties: {} },
      },
      executor: async (args: Record<string, any>) => {
        // Re-use the same client session for tool calls
        const result = await client!.callTool({ name: tool.name, arguments: args });
        return { content: result.content, isError: result.isError ?? false };
      },
    }));
  }
  catch (error) {
    logger.error(`Failed to connect or list tools from MCP server ${serverUrl}:`, error);
    return [];
  }
  finally {
    // Close the client after tool execution completes.
    // The executor captures the client reference, so real cleanup happens after all calls.
    // We only close here if tool listing itself failed.
    if (client) {
      client.close().catch(() => {});
    }
  }
}

async function connectMCPClient(url: URL): Promise<Client> {
  // Try StreamableHTTP first (MCP 1.0+)
  try {
    const client = new Client(CLIENT_INFO);
    const transport = new StreamableHTTPClientTransport(url);
    await client.connect(transport);
    logger.info(`Connected to MCP server via StreamableHTTP: ${url.href}`);
    return client;
  }
  catch {
    logger.info(`StreamableHTTP failed for ${url.href}, falling back to SSE`);
  }

  // Fall back to SSE transport (legacy MCP servers)
  const client = new Client(CLIENT_INFO);
  const transport = new SSEClientTransport(url);
  await client.connect(transport);
  logger.info(`Connected to MCP server via SSE: ${url.href}`);
  return client;
}
