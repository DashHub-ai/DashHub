import 'reflect-metadata';

import process from 'node:process';

import { pipe } from 'fp-ts/lib/function';
import { container } from 'tsyringe';

import { runTaskAsVoid, tapTaskEither, tapTaskEitherTE, tryOrThrowTE } from '@llm/commons';
import { ElasticsearchIndicesRegistryRepo, ElasticsearchRepo } from '~/modules';
import { ElasticsearchRegistryBootService } from '~/modules/elasticsearch/boot';

const bootService = container.resolve(ElasticsearchRegistryBootService);
const registry = container.resolve(ElasticsearchIndicesRegistryRepo);
const esConnection = container.resolve(ElasticsearchRepo);

void pipe(
  bootService.register,
  tapTaskEitherTE(registry.reindexAll),
  tapTaskEitherTE(() => esConnection.close),
  tapTaskEither(() => {
    process.exit(0);
  }),
  tryOrThrowTE,
  runTaskAsVoid,
);
