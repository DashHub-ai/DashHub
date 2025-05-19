import type { Transaction } from 'kysely';

import {
  either as E,
  taskEither as TE,
} from 'fp-ts';

import {
  isTaggedError,
  type Nullable,
  type TaggedError,
} from '@dashhub/commons';

import type { DatabaseTables } from '../database.tables';
import type { KyselyDatabase } from '../types';

import { TransactionError } from './transaction.error';

export type TransactionalQueryBuilder =
  | Transaction<DatabaseTables>
  | KyselyDatabase;

export type TransactionalAttrs<T = unknown> = T & {
  forwardTransaction?: TransactionalQueryBuilder;
};

export type ForwardTransactionCreatorAttrs = {
  db: KyselyDatabase;
  forwardTransaction: Nullable<TransactionalQueryBuilder>;
};

/**
 * If function receives transaction - uses it.
 * If not - uses created new one
 *
 * @example
 *  const fn = ({ forwardTransaction, ... }: TransactionalAttrs<...>) => {
 *    const transactional = forwardTransactionOrCreate({
 *      db,
 *      forwardTransaction,
 *    });
 *
 *    return transactional(async trx => {
 *      ...
 *    });
 *  };
 */
export function tryReuseOrCreateTransaction({ db, forwardTransaction }: ForwardTransactionCreatorAttrs) {
  return <A, E extends TaggedError<any>>(
    callback: (trx: TransactionalQueryBuilder) => TE.TaskEither<E, A>,
  ): TE.TaskEither<E | TransactionError, A> => {
    if (forwardTransaction) {
      return callback(forwardTransaction);
    }

    return TE.tryCatch(
      async () =>
        db.transaction().execute<A>(async (trx) => {
          const data = await callback(trx)();

          if (E.isLeft(data)) {
            throw data.left;
          }

          return data.right;
        }),
      (error) => {
        if (isTaggedError(error)) {
          return error as unknown as E;
        }

        return new TransactionError(error);
      },
    );
  };
}
