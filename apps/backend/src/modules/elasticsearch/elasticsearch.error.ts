import type { Task } from 'fp-ts/lib/Task';

import { taskEither as TE } from 'fp-ts';

import { TaggedError } from '@llm/commons';

import type { EsDocumentId } from './elasticsearch.type';

/**
 * Error that occurs when an Elasticsearch internal error occurs.
 */
export class EsInternalError extends TaggedError.ofLiteral()('EsInternalError') {
  static tryTask<T>(task: Task<T>) {
    return TE.tryCatch(task, (err: any) => new EsInternalError(err));
  }
}

/**
 * Error that occurs when an Elasticsearch record is not found.
 */
export class EsDocumentNotFoundError extends TaggedError.ofLiteral<{
  id?: EsDocumentId;
  indexName?: string;
}>()('EsDocumentNotFoundError') {}

/**
 * Error that occurs when an Elasticsearch delete index operation fails.
 */
export class EsDeleteIndexError extends TaggedError.ofLiteral()('EsDeleteIndexError') {}

/**
 * Error that occurs when an Elasticsearch delete document operation fails.
 */
export class EsDeleteDocumentError extends TaggedError.ofLiteral()('EsDeleteDocumentError') {}

/**
 * Error that occurs when an Elasticsearch delete documents operation fails.
 */
export class EsDeleteDocumentsError extends TaggedError.ofLiteral()('EsDeleteDocumentsError') {}

/**
 * Error that occurs when an Elasticsearch create index operation fails.
 */
export class EsCreateIndexError extends TaggedError.ofLiteral()('EsCreateIndexError') {}

/**
 * Error that occurs when an Elasticsearch alias operation fails.
 */
export class EsAliasIndexError extends TaggedError.ofLiteral()('EsAliasIndexError') {}

/**
 * Error that occurs when an Elasticsearch indexing operation fails.
 */
export class EsIndexingError extends TaggedError.ofLiteral()('EsIndexingError') {}

/**
 * Error that occurs when an Elasticsearch query fails.
 */
export class EsQueryError extends TaggedError.ofLiteral()('EsQueryError') {}

/**
 * Error that occurs when a bulk index operation fails.
 */
export class EsBulkIndexError extends TaggedError.ofLiteral()('EsBulkIndexError') {}
