import 'reflect-metadata';

import { pipe } from 'fp-ts/lib/function';
import { container } from 'tsyringe';

import { runTaskAsVoid, tapTaskEitherTE, tryOrThrowTE } from '@llm/commons';
import { DatabaseConnectionRepo, ElasticsearchRepo } from '~/modules';
import { ChatsSummariesService } from '~/modules/chats-summaries';

const databaseConnectionRepo = container.resolve(DatabaseConnectionRepo);
const esConnection = container.resolve(ElasticsearchRepo);

const summariesService = container.resolve(ChatsSummariesService);

void pipe(
  summariesService.summarizeAllChats(),
  tapTaskEitherTE(() => esConnection.close),
  tapTaskEitherTE(() => databaseConnectionRepo.close),
  tryOrThrowTE,
  runTaskAsVoid,
);
