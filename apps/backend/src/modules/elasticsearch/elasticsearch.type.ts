import type { CamelCaseToSnakeCaseObject } from '@llm/commons';

/**
 * Elasticsearch document id
 */
export type EsDocumentId = string;

/**
 * Base Elasticsearch document type
 */
export type EsBaseDocument = {
  _id: EsDocumentId;
};

/**
 * Elasticsearch inner document type
 */
export type EsInnerDocument<I> = CamelCaseToSnakeCaseObject<I>;

/**
 * Elasticsearch document type
 */
export type EsDocument<I> = EsInnerDocument<I> & EsBaseDocument;

/**
 * Elasticsearch hit source type
 */
export type EsHitSource = Record<string, any>;

/**
 * Elasticsearch hit type
 */
export type EsHit<S extends EsHitSource = EsHitSource> = {
  _id: string;
  _source: Partial<S>;
  sort?: any[];
};

/**
 * Elasticsearch hit aggregations type
 */
export type EsHitAggregations = Record<any, any>;

/**
 * Elasticsearch hits response type
 */
export type EsHitsResponse<S extends EsHitSource = EsHitSource> = {
  aggregations: EsHitAggregations;
  hits: {
    hits: Array<EsHit<S>>;
    total: {
      value: number;
    };
  };
};
