import type { KyselyDatabase } from '../types';
import type { ForwardTransactionCreatorAttrs } from './try-reuse-or-create-transaction';

/**
 * If function receives transaction - uses it.
 * If not - skips transaction
 */
export function tryReuseTransactionOrSkip({ db, forwardTransaction }: ForwardTransactionCreatorAttrs) {
  return <R>(callback: (qb: KyselyDatabase) => R) =>
    () => {
      if (forwardTransaction) {
        return callback(forwardTransaction);
      }

      return callback(db);
    };
}
