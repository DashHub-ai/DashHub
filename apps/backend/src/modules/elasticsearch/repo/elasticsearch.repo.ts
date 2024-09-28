import * as es from '@elastic/elasticsearch';
import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, singleton } from 'tsyringe';

import {
  defaultUrlProtocol,
  getFirstObjKeyValue,
  TaggedError,
  tapTaskEitherTE,
  waitFor,
} from '@llm/commons';

import type {
  EsBaseDocument,
  EsDocumentId,
  EsHitsResponse,
} from '../elasticsearch.type';

import { ConfigService } from '../../config';
import { LoggerService } from '../../logger';
import {
  EsAliasIndexError,
  EsCreateIndexError,
  EsDeleteDocumentError,
  EsDeleteIndexError,
  EsDocumentNotFoundError,
  EsIndexingError,
  EsInternalError,
  EsQueryError,
} from '../elasticsearch.error';
import { appendTimestampToIndexName } from '../helpers';

/**
 * Base functional client of Elasticsearch.
 */
@singleton()
export class ElasticsearchRepo {
  private readonly client: es.Client;

  private readonly logger = LoggerService.of('ElasticsearchRepo');

  constructor(
    @inject(ConfigService) configService: ConfigService,
  ) {
    const { hostname, port, auth } = configService.config.elasticsearch;
    const options: es.ClientOptions = {
      node: pipe(
        `${hostname}:${port}`,
        defaultUrlProtocol('http'),
      ),

      ...auth && {
        auth: {
          username: auth.user,
          password: auth.password,
        },
        ssl: {
          rejectUnauthorized: false,
        },
      },
    };

    this.client = new es.Client(options);
    this.logger.info('Elasticsearch client initialized with options:', options);
  }

  /**
   * Closes the Elasticsearch client.
   */
  close = EsInternalError.tryTask(async () => {
    await this.client.close();
  });

  /**
   * Gets a document from the specified index.
   *
   * @param indexName - The name of the index.
   * @param id - The id of the document.
   * @returns The document.
   */
  getDocument = <D extends EsBaseDocument = EsBaseDocument>(
    indexName: string,
    id: EsDocumentId,
  ) =>
    TaggedError.tryUnsafeTask(EsDocumentNotFoundError, async () => {
      const result = await this.client.get({
        index: indexName,
        id,
      });

      return result._source as D;
    });

  /**
   * Deletes a document from the specified index.
   *
   * @param indexName - The name of the index.
   * @param id - The id of the document.
   * @param attributes - The attributes for the delete operation.
   * @param attributes.waitForRecordAvailability - Whether to wait for the record to be removed.
   */
  deleteDocument = (
    indexName: string,
    id: EsDocumentId,
    { waitForRecordAvailability }: EsIndexWaitAttributes = {},
  ) =>
    pipe(
      TaggedError.tryUnsafeTask(EsDeleteDocumentError, async () => {
        const result = await this.client.delete({
          index: indexName,
          id,
        });

        return result;
      }),

      TE.chainW(() => (
        waitForRecordAvailability
          ? this.waitForDocumentAvailabilityOrThrow(indexName, id, false)
          : TE.right(undefined)
      )),
    );

  /**
   * Deletes multiple documents from the specified index.
   *
   * @param indexName - The name of the index.
   * @param ids - The ids of the documents.
   * @returns The deleted documents.
   */
  deleteDocuments = (
    indexName: string,
    ids: EsDocumentId[],
  ) => TaggedError.tryUnsafeTask(EsDeleteDocumentError, async () => this.client.bulk({
    refresh: true,
    body: ids.flatMap(id => [
      {
        delete: {
          _index: indexName,
          _id: id.toString(),
        },
      },
    ]),
  }));

  /**
   * Indexes a document in the specified index.
   *
   * @param indexName - The name of the index.
   * @param doc - The document to index.
   * @param doc._id - The id of the document.
   * @param attributes - The attributes for the index operation.
   * @param attributes.waitForRecordAvailability - Whether to wait for the record to be available.
   */
  indexDocument = <D extends EsBaseDocument = EsBaseDocument>(
    indexName: string,
    { _id, ...doc }: D,
    { waitForRecordAvailability }: EsIndexWaitAttributes = {},
  ) =>
    pipe(
      TaggedError.tryUnsafeTask(EsIndexingError, async () => this.client.index({
        id: _id.toString(),
        index: indexName,
        body: doc,
      })),

      TE.chainW(() => (
        waitForRecordAvailability
          ? this.waitForDocumentAvailabilityOrThrow(indexName, _id)
          : TE.right(undefined)
      )),
    );

  /**
   * Indexes multiple documents in the specified index.
   *
   * @param indexName - The name of the index.
   * @param docs - The documents to index.
   * @returns The indexed documents.
   */
  indexDocuments = <D extends EsBaseDocument = EsBaseDocument>(
    indexName: string,
    docs: D[],
  ) =>
    TaggedError.tryUnsafeTask(EsIndexingError, async () => this.client.bulk({
      refresh: true,
      body: docs.flatMap(({ _id, ...doc }) => [
        {
          index: {
            _index: indexName,
            _id: _id.toString(),
          },
        },
        doc,
      ]),
    }));

  /**
   * Elasticsearch has a delay between indexing and being able to query the document so this method
   * will wait for the document to be available or throw an error.
   *
   * @param indexName - The name of the index.
   * @param id - The id of the document.
   * @param expectedExistState - The expected state of the document.
   */
  waitForDocumentAvailabilityOrThrow = (
    indexName: string,
    id: EsDocumentId,
    expectedExistState: boolean = true,
  ) =>
    TE.tryCatch(
      () => waitFor(
        async () => {
          const result = await this.client.exists({
            index: indexName,
            id,
          });

          if (result !== expectedExistState) {
            throw new EsDocumentNotFoundError(
              {
                id,
                indexName,
              },
            );
          }

          return true;
        },
        {
          timeOutAfter: 1500,
          retryAfter: 150,
        },
      ),
      error => error as EsDocumentNotFoundError,
    );

  /**
   * Gets the indices associated with the specified alias.
   *
   * @param alias - The alias to get the indices for.
   * @returns The indices associated with the alias.
   */
  getIndicesByAlias = (alias: string) =>
    TaggedError.tryUnsafeTask(EsInternalError, async () => {
      try {
        const result = await this.client.indices.getAlias({
          name: alias,
        });

        return Object.keys(result ?? {});
      }
      catch (error: any) {
        if (error.meta?.statusCode === 404) {
          return [];
        }
        else {
          throw error;
        }
      }
    });

  /**
   * Puts alias on the specified index.
   *
   * @param sourceIndex - The source index.
   * @param alias - The alias to put on the source index.
   */
  putAlias = (sourceIndex: string, alias: string) =>
    TaggedError.tryUnsafeTask(EsAliasIndexError, async () => {
      this.logger.info(`Putting alias: ${alias} on index: ${sourceIndex}`);

      await this.client.indices.putAlias({
        index: sourceIndex,
        name: alias,
      });

      this.logger.info(`Alias: ${alias} put on index: ${sourceIndex}!`);
    });

  /**
   * Checks if alias exists.
   *
   * @param alias - The alias to name.
   */
  existsAlias = (alias: string) =>
    TaggedError.tryUnsafeTask(
      EsInternalError,
      async () => this.client.indices.existsAlias({
        name: alias,
      }),
    );

  /**
   * Search for documents in the specified index.
   *
   * @param request - The search request.
   * @returns The search results.
   */
  search = <D extends EsBaseDocument = EsBaseDocument>(
    request: es.estypes.SearchRequest | es.estypesWithBody.SearchRequest,
  ) =>
    TaggedError.tryUnsafeTask(EsQueryError, async () => {
      const startTime = Date.now();

      this.logger.info('Performing query:', request);

      const result = await this.client.search(request);

      this.logger.info(`Search request took: ${Date.now() - startTime} ms`);

      return result as EsHitsResponse<D>;
    });

  /**
   * Gets the mapping for the specified index.
   *
   * @param index - The index to get the mapping for.
   */
  getIndexMapping = (index: string) =>
    TaggedError.tryUnsafeTask(EsInternalError, async () => {
      const result = await this.client.indices.getMapping({
        index,
      });

      return getFirstObjKeyValue(result).mappings;
    });

  /**
   * Creates an index.
   *
   * @param dto - The index creation request.
   * @returns The created index.
   */
  createIndex = (dto: es.estypes.IndicesCreateRequest) =>
    pipe(
      TaggedError.tryUnsafeTask(EsCreateIndexError, async () => {
        this.logger.info('Creating index:', { name: dto.index });

        await this.client.indices.create(dto);

        this.logger.info('Index created:', { name: dto.index });
      }),
      TE.map(() => ({
        name: dto.index,
      })),
    );

  /**
   * Creates a temporary index.
   *
   * @param aliasName - The alias name.
   * @param dto - The index creation request.
   * @returns The created index.
   */
  createTempIndex = (
    aliasName: string,
    dto: Omit<es.estypes.IndicesCreateRequest, 'index'>,
  ) =>
    this.createIndex({
      ...dto,
      index: appendTimestampToIndexName(aliasName),
    });

  /**
   * Deletes the specified indices.
   *
   * @param indices - The indices to delete.
   * @returns The deleted indices.
   */
  deleteIndices = (indices: string | string[]) =>
    TaggedError.tryUnsafeTask(EsDeleteIndexError, async () => {
      if (indices.length) {
        this.logger.info('Deleting indices...', { indices });

        await this.client.indices.delete({
          ignore_unavailable: true,
          index: indices,
        });

        this.logger.info('Deleted indices!', { indices });
      }
    });

  /**
   * Creates an index and puts an alias on it if it does not exist.
   *
   * If the alias already exists, it will not create the index and will return a status of 'already-exists'.
   *
   * @param aliasName - The alias name.
   * @param dto - The index creation request.
   */
  createIndexAndAliasIfNotExists = (
    aliasName: string,
    dto: Omit<es.estypes.IndicesCreateRequest, 'index'>,
  ) =>
    pipe(
      this.existsAlias(aliasName),
      TE.chainW((exists) => {
        if (exists) {
          return TE.of({
            status: 'already-exists',
          });
        }

        const aliasedIndexName = appendTimestampToIndexName(aliasName);

        return pipe(
          this.createIndex({
            index: aliasedIndexName,
            ...dto,
          }),
          TE.chainW(() => this.putAlias(aliasedIndexName, aliasName)),
          tapTaskEitherTE(() => this.deleteIndices(aliasedIndexName)),
          TE.map(() => ({
            status: 'created',
          })),
        );
      }),
    );
}

/**
 * Configuration for the index operation.
 */
export type EsIndexWaitAttributes = {
  waitForRecordAvailability?: boolean;
};
