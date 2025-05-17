import 'reflect-metadata';

import { pipe } from 'fp-ts/lib/function';
import { container } from 'tsyringe';

import { runTaskAsVoid, tapTaskEitherTE, tryOrThrowTE } from '@dashhub/commons';
import { DatabaseConnectionRepo, ElasticsearchRepo } from '~/modules';
import { ProjectsSummariesService } from '~/modules/projects-summaries';

const databaseConnectionRepo = container.resolve(DatabaseConnectionRepo);
const esConnection = container.resolve(ElasticsearchRepo);

const summariesService = container.resolve(ProjectsSummariesService);

void pipe(
  summariesService.summarizeAllProjects(),
  tapTaskEitherTE(() => esConnection.close),
  tapTaskEitherTE(() => databaseConnectionRepo.close),
  tryOrThrowTE,
  runTaskAsVoid,
);
