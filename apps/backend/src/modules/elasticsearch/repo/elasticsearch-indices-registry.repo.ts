import { array as A, taskEither as TE } from 'fp-ts';
import { flow, pipe } from 'fp-ts/lib/function';
import { singleton } from 'tsyringe';

import type { TaggedError } from '@dashhub/commons';

import type {
  EsIndexApproxSize,
  EsReindexAllAttributes,
} from './elasticsearch-index.repo';

/**
 * Elasticsearch document type.
 */
export type EsIndexOperatorRegistryEntry = {
  /**
   * The index name of the repository.
   */
  readonly approxSize: EsIndexApproxSize;

  /**
   * Reindex all documents on the temp index.
   */
  checkIfExistsAndReindexAllIfSchemaChanged: (
    attributes?: EsReindexAllAttributes
  ) => TE.TaskEither<TaggedError<string>, void>;
};

/**
 * Elasticsearch index registry repository.
 */
@singleton()
export class ElasticsearchIndicesRegistryRepo {
  private readonly repos: EsIndexOperatorRegistryEntry[] = [];

  registerIndexRepo = (index: EsIndexOperatorRegistryEntry) => {
    this.registerIndexRepos([index]);
  };

  registerIndexRepos = (indices: EsIndexOperatorRegistryEntry[]) => {
    this.repos.push(...indices);
  };

  reindexAllWithChangedSchema = () =>
    pipe(
      this.repos,
      A.map(repo => repo.checkIfExistsAndReindexAllIfSchemaChanged()),
      TE.sequenceSeqArray,
    );

  fastReindexAll = () =>
    pipe(
      this.repos,
      A.filter(repo => repo.approxSize !== 'large'),
      ElasticsearchIndicesRegistryRepo.reindexRepos,
    );

  reindexAll = () => ElasticsearchIndicesRegistryRepo.reindexRepos(this.repos);

  static reindexRepos = flow(
    A.map((item: EsIndexOperatorRegistryEntry) =>
      item.checkIfExistsAndReindexAllIfSchemaChanged({
        skipSchemaChangeCheck: true,
      }),
    ),
    A.sequence(TE.ApplicativeSeq),
  );
}
