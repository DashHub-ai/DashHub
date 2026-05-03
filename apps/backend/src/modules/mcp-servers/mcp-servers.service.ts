import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type { AIProxyAsyncFunction } from '~/modules/ai-connector/clients';
import type { TableId } from '~/modules/database';

import { getMCPServerAsyncFunctions } from './mcp-servers.client';
import { MCPServersRepo } from './mcp-servers.repo';

@injectable()
export class MCPServersService {
  constructor(
    @inject(MCPServersRepo) private readonly repo: MCPServersRepo,
  ) {}

  /**
   * Returns all tool functions from all enabled MCP servers for the given org.
   * Failures on individual servers are swallowed so one bad server doesn't
   * break the whole reply.
   */
  getMCPAsyncFunctions = (organizationId: TableId): TE.TaskEither<never, AIProxyAsyncFunction[]> =>
    pipe(
      this.repo.findEnabledByOrganizationId({ organizationId }),
      TE.mapLeft(() => [] as AIProxyAsyncFunction[]),
      TE.chainW(servers =>
        TE.tryCatch(
          async () => {
            const results = await Promise.allSettled(
              servers.map(server =>
                getMCPServerAsyncFunctions(server.id, server.url),
              ),
            );

            return results.flatMap(r => r.status === 'fulfilled' ? r.value : []);
          },
          () => [] as AIProxyAsyncFunction[],
        ),
      ),
      TE.orElse(() => TE.of([])),
    );
}
