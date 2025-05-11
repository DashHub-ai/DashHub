import type { Promisable } from 'type-fest';

import { Queue } from 'async-await-queue';
import deepEq from 'fast-deep-equal';
import { taskEither as TE } from 'fp-ts';
import { identity, pipe } from 'fp-ts/lib/function';
import hash from 'object-hash';
import { inject } from 'tsyringe';

import type { RelaxedId } from '@dashhub/commons';

import {
  delayTaskEither,
  TaggedError,
  tapTaskEitherErrorTE,
  tapTaskEitherTE,
  tryOrThrowTE,
} from '@dashhub/commons';
import { LoggerService } from '~/modules/logger';

import type { EsBaseDocument } from '../elasticsearch.type';
import type { EsIndexOperatorRegistryEntry } from './elasticsearch-indices-registry.repo';
import type { EsIndexWaitAttributes } from './elasticsearch.repo';

import { EsDocumentNotFoundError, EsIndexingError } from '../elasticsearch.error';
import { ElasticsearchRepo } from './elasticsearch.repo';

/**
 * Create Elasticsearch index repository. It's used to create a repository for a specific index.
 * It's connector between elasticsearch and other database providers. `RelaxedId` is used to ensure
 * that the id can be both string and number.
 *
 * Reindex algorithm:
 *  1. Check if index exists and if not exists create it.
 *  2. Check if schema has changed and re-index all documents if needed.
 *  3. Re-index all documents on the temp index and then switch alias to the temp index.
 *  4. Delete original index as it is not needed anymore.
 *
 * @param attrs - The factory attributes.
 * @param attrs.indexName - The index name.
 * @param attrs.schema - The index schema definition.
 * @param attrs.approxSize - The index size information. It's optional and is used to determine
 *                           the size of the index and frequency of the index re-indexing.
 * @returns The Elasticsearch index repository.
 */
export function createElasticsearchIndexRepo<
  IndexName extends string,
  Schema extends EsIndexSchemaDefinition,
>(
  {
    indexName: aliasIndexName,
    schema,
    approxSize = 'normal',
  }: EsIndexRepoFactoryAttrs<IndexName, Schema>,
) {
  abstract class EsIndexRepo<Document extends EsBaseDocument> implements EsIndexOperatorRegistryEntry {
    /**
     * The index name of the repository.
     */
    readonly indexName = aliasIndexName;

    /**
     * The logger instance.
     */
    readonly logger = LoggerService.of(`EsIndexRepo[${aliasIndexName}]`);

    /**
     * The index name of the repository.
     */
    readonly approxSize: EsIndexApproxSize = approxSize;

    constructor(
      @inject(ElasticsearchRepo) readonly elasticsearchRepo: ElasticsearchRepo,
    ) {
      if (elasticsearchRepo.isLoggingDisabled()) {
        this.logger.pause();
      }
    }

    /**
     * Find all entities by ids. It's executed to get document to be re-indexed on the temp index.
     *
     * @param ids - The document ids.
     * @returns The documents.
     */
    protected abstract findEntities(ids: RelaxedId[]): Promisable<Document[]>;

    /**
     * Create all entities ids iterator. It's executed to get all document ids to be re-indexed on the temp index.
     *
     * @returns The document ids iterator.
     */
    protected abstract createAllEntitiesIdsIterator(): EsDocumentIdsAsyncIterator;

    /**
     * Get single document by id.
     *
     * @param id - The document id.
     * @returns The document.
     */
    getDocument = (id: RelaxedId) =>
      this.elasticsearchRepo.getDocument<Document>(aliasIndexName, String(id));

    /**
     * Search documents by query.
     *
     * @param body - The query body.
     * @returns The search result.
     */
    search = (body: object) =>
      this.elasticsearchRepo.search<Document>({
        index: aliasIndexName,
        body,
      });

    /**
     * Delete single document by id.
     *
     * @param id - The document id.
     * @param reindexAttributes - The re-indexing attributes.
     * @returns The delete result.
     */
    deleteDocument = (id: RelaxedId, reindexAttributes: EsIndexWaitAttributes = {}) =>
      this.elasticsearchRepo.deleteDocument(aliasIndexName, String(id), reindexAttributes);

    /**
     * Delete documents by query.
     *
     * @param query - The query.
     * @param reindexAttributes - The re-indexing attributes.
     * @returns The delete result.
     */
    deleteByQuery = (query: object, reindexAttributes: EsIndexWaitAttributes = {}) =>
      this.elasticsearchRepo.deleteByQuery(aliasIndexName, query, reindexAttributes);

    /**
     * Delete documents by ids.
     *
     * @param ids - The document ids.
     * @returns The delete result.
     */
    deleteDocuments = (ids: RelaxedId[]) =>
      this.elasticsearchRepo.deleteDocuments(aliasIndexName, ids.map(String));

    /**
     * Index single document.
     *
     * @param document - The document to be indexed.
     * @param reindexAttributes - The re-indexing attributes.
     * @returns The index result.
     */
    indexDocument = (document: Document, reindexAttributes?: EsIndexWaitAttributes) =>
      this.elasticsearchRepo.indexDocument(aliasIndexName, document, reindexAttributes);

    /**
     * Find single record (from the database) and index it.
     *
     * @param id - The document id.
     * @param reindexAttributes - The re-indexing attributes.
     * @returns The index result.
     */
    findAndIndexDocumentById = (id: RelaxedId, reindexAttributes?: EsIndexWaitAttributes) =>
      pipe(
        TE.tryCatch(
          async () => {
            const [document] = await this.findEntities([id]);

            if (!document) {
              throw new EsDocumentNotFoundError({
                id: String(id),
                indexName: aliasIndexName,
              });
            }

            return document;
          },
          error => error as EsDocumentNotFoundError,
        ),
        TE.chainW(document => this.indexDocument(document, reindexAttributes)),
      );

    /**
     * Find and index documents by ids.
     *
     * @param ids - The document ids.
     * @param overrideIndexName - The override index name.
     * @returns The index result.
     */
    findAndIndexDocumentsByIds = (
      ids: RelaxedId[],
      overrideIndexName: string = aliasIndexName,
    ) => {
      if (!ids.length) {
        return TE.of(undefined);
      }

      return pipe(
        TaggedError.tryUnsafeTask(EsIndexingError, async () => this.findEntities(ids)),
        TE.chainW(
          documents =>
            documents.length
              ? this.elasticsearchRepo.indexDocuments(overrideIndexName, documents)
              : TE.right(undefined),
        ),
      );
    };

    /**
     * Find and reindex documents ids using stream iterator.
     *
     * @param stream - The stream iterator.
     * @param overrideIndexName - The override index name.
     * @returns The re-indexing task.
     */
    findAndIndexDocumentsByStream = (() => {
      const streamReindexQueue = new Queue(1);

      return (stream: EsDocumentIdsAsyncIterator) =>
        (overrideIndexName: string = aliasIndexName) =>
          pipe(
            TaggedError.tryUnsafeTask(EsIndexingError, async () => {
              let offset: number = 0;

              for await (const ids of stream) {
                this.logger.info(`Re-indexing documents from offset: ${offset}!`);

                await pipe(
                  this.findAndIndexDocumentsByIds(ids, overrideIndexName),
                  tryOrThrowTE,
                )();

                offset += ids.length;
              }
            }),
            task => async () => streamReindexQueue.run(task),
          );
    })();

    /**
     * Check if index exists and if not exists create it. Then check if schema has changed and re-index all documents if needed.
     *
     * @param reindexAttributes - The re-indexing attributes.
     * @param reindexAttributes.forceReindex - The flag to force re-indexing.
     * @returns The task to check if index exists and re-index all documents if needed.
     */
    checkIfExistsAndReindexAllIfSchemaChanged = (reindexAttributes?: EsReindexAllAttributes) =>
      pipe(
        TE.Do,
        TE.bind('upsertResult', () =>
          this.elasticsearchRepo.createIndexAndAliasIfNotExists(
            aliasIndexName,
            assignIndexSchemaMeta(schema),
          )),

        TE.bind('schemaChanged', ({ upsertResult }) => {
          if (reindexAttributes?.skipSchemaChangeCheck) {
            return TE.of(true);
          }

          return (
            upsertResult.status === 'created'
              ? TE.of(true)
              : this.checkIfSchemaChanged()
          );
        }),
        TE.chain(({ schemaChanged }) =>
          schemaChanged
            ? this.findAndReindexAll()
            : TE.of(undefined),
        ),
      );

    /**
     * Reindex all document in the index.
     *
     * @param attributes - The re-indexing attributes.
     * @param attributes.waitForRecordAvailability - The flag to wait for record availability.
     * @returns The re-indexing task.
     */
    findAndReindexAll = ({ waitForRecordAvailability }: EsIndexWaitAttributes = {}) =>
      pipe(
        this.createAllEntitiesIdsIterator(),
        this.findAndIndexDocumentsByStream,
        this.execOnTempIndexAndSwitch,
        waitForRecordAvailability ? delayTaskEither(1000) : identity,
      );

    /**
     * Check if mapping is outdated.
     *
     * @returns The task to check if mapping changed.
     */
    checkIfSchemaChanged() {
      return pipe(
        this.elasticsearchRepo.getIndexMapping(aliasIndexName),
        TE.map(
          mappings =>
            !deepEq(
              getIndexSchemaMeta({ mappings }),
              genIndexSchemaMeta(schema),
            ),
        ),
      );
    }

    /**
     * Reindex all documents on the temp index and then switch alias to the temp index.
     *
     * @param getTask - The task to be executed on the temp index.
     * @returns The re-indexing task.
     */
    execOnTempIndexAndSwitch = <E, A>(
      getTask: (tempIndexName: string) => TE.TaskEither<E, A>,
    ) => {
      const { elasticsearchRepo } = this;

      return pipe(
        elasticsearchRepo.createTempIndex(
          aliasIndexName,
          assignIndexSchemaMeta(schema),
        ),
        TE.chainW(tempIndex =>
          pipe(
            TE.Do,

            // Get original indices
            TE.bind('originalIndices', () =>
              elasticsearchRepo.getIndicesByAlias(aliasIndexName)),

            // Execute the task on the temp index.
            TE.bindW('taskResult', () => getTask(tempIndex.name)),

            // Switch alias to the temp index.
            tapTaskEitherTE(() =>
              elasticsearchRepo.putAlias(tempIndex.name, aliasIndexName),
            ),

            // Delete original indices and switch alias back to the original index.
            tapTaskEitherErrorTE((error) => {
              this.logger.error('Failed to switch alias!', error);

              return elasticsearchRepo.deleteIndices(tempIndex.name);
            }),

            // Delete original index as it is not needed anymore.
            TE.chainW(({ originalIndices }) =>
              elasticsearchRepo.deleteIndices(originalIndices),
            ),
          ),
        ),
      );
    };
  }

  return EsIndexRepo;
}

/**
 * Generate index schema meta version based on the schema.
 */
function genIndexSchemaMeta(schema: EsIndexSchemaDefinition): EsIndexMetaSchemaDefinition {
  return {
    schemaVersion: hash(schema),
  };
}

/**
 * Assign index schema meta to the index schema.
 */
function assignIndexSchemaMeta(schema: EsIndexSchemaDefinition): EsIndexSchemaDefinition {
  return {
    ...schema,
    mappings: {
      _meta: genIndexSchemaMeta(schema),
      ...schema.mappings,
    },
  };
}

/**
 * Picks meta schema from the index mappings.
 */
function getIndexSchemaMeta(schema: Pick<EsIndexSchemaDefinition, 'mappings'>): EsIndexMetaSchemaDefinition {
  return schema.mappings._meta;
}

/**
 * Elasticsearch document ids async iterator.
 */
export type EsDocumentIdsAsyncIterator = AsyncIterableIterator<RelaxedId[]>;

/**
 * Elasticsearch reindex attributes used to determine the re-indexing process.
 */
export type EsReindexAllAttributes = {
  skipSchemaChangeCheck?: boolean;
};

/**
 * Elasticsearch index repository factory attributes.
 */
type EsIndexRepoFactoryAttrs<
  IndexName extends string,
  Schema extends EsIndexSchemaDefinition,
> = {
  /**
   * The index name.
   */
  indexName: IndexName;

  /**
   * The index schema definition.
   */
  schema: Schema;

  /**
   * The index size information. It's optional and is used to determine the size of the index.
   * It'll help to determine frequency of the index re-indexing.
   */
  approxSize?: EsIndexApproxSize;
};

/**
 * Elasticsearch document type.
 */
export type EsIndexApproxSize = 'large' | 'normal';

/**
 * Elasticsearch index schema definition.
 */
type EsIndexSchemaDefinition = {
  mappings: Record<string, any>;
  settings?: Record<string, any>;
};

/**
 * Elasticsearch index meta schema definition used to determine if schema has changed.
 */
type EsIndexMetaSchemaDefinition = {
  schemaVersion: string;
};
