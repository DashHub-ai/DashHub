import camelcaseKeys from 'camelcase-keys';
import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { injectable } from 'tsyringe';

import {
  createProtectedDatabaseRepo,
  DatabaseError,
  DatabaseRecordNotExists,
  TableId,
  TransactionalAttrs,
  tryReuseTransactionOrSkip,
} from '~/modules/database';

import type {
  EvalCaseTableRow,
  EvalResultTableRow,
  EvalRunStatus,
  EvalRunTableRow,
  EvalSuiteTableRowWithRelations,
} from './evals.tables';

@injectable()
export class EvalSuitesRepo extends createProtectedDatabaseRepo('eval_suites') {
  createIdsIterator = this.baseRepo.createIdsIterator;

  create = ({ forwardTransaction, value: { organization, ...value } }: TransactionalAttrs<{
    value: { organization: { id: TableId; }; name: string; description?: string | null; };
  }>) => this.baseRepo.create({
    forwardTransaction,
    value: {
      ...value,
      organizationId: organization.id,
    },
  });

  findByOrganizationId = ({ forwardTransaction, organizationId }: TransactionalAttrs<{ organizationId: TableId; }>) => {
    const transaction = tryReuseTransactionOrSkip({ db: this.db, forwardTransaction });

    return pipe(
      transaction(
        async qb =>
          qb
            .selectFrom(this.table)
            .where('eval_suites.organization_id', '=', organizationId)
            .innerJoin('organizations', 'organizations.id', 'organization_id')
            .selectAll('eval_suites')
            .select([
              'organizations.id as organization_id',
              'organizations.name as organization_name',
            ])
            .orderBy('eval_suites.created_at', 'desc')
            .execute(),
      ),
      DatabaseError.tryTask,
      TE.map(
        A.map(({
          organization_id: orgId,
          organization_name: orgName,
          ...item
        }): EvalSuiteTableRowWithRelations => ({
          ...camelcaseKeys(item),
          organization: { id: orgId, name: orgName },
        })),
      ),
    );
  };

  findById = ({ forwardTransaction, id }: TransactionalAttrs<{ id: TableId; }>) => {
    const transaction = tryReuseTransactionOrSkip({ db: this.db, forwardTransaction });

    return pipe(
      transaction(
        async qb =>
          qb
            .selectFrom(this.table)
            .where('eval_suites.id', '=', id)
            .innerJoin('organizations', 'organizations.id', 'organization_id')
            .selectAll('eval_suites')
            .select([
              'organizations.id as organization_id',
              'organizations.name as organization_name',
            ])
            .executeTakeFirst(),
      ),
      DatabaseError.tryTask,
      TE.chainW((row) => {
        if (!row) {
          return TE.left(new DatabaseRecordNotExists({}));
        }

        const {
          organization_id: orgId,
          organization_name: orgName,
          ...rest
        } = row;

        return TE.right({
          ...camelcaseKeys(rest),
          organization: { id: orgId, name: orgName },
        } as EvalSuiteTableRowWithRelations);
      }),
    );
  };
}

@injectable()
export class EvalCasesRepo extends createProtectedDatabaseRepo('eval_cases') {
  create = ({ forwardTransaction, value }: TransactionalAttrs<{
    value: { suiteId: TableId; inputMessage: string; expectedNote?: string | null; };
  }>) => this.baseRepo.create({ forwardTransaction, value });

  findBySuiteId = ({ forwardTransaction, suiteId }: TransactionalAttrs<{ suiteId: TableId; }>) => {
    const transaction = tryReuseTransactionOrSkip({ db: this.db, forwardTransaction });

    return pipe(
      transaction(
        async qb =>
          qb
            .selectFrom(this.table)
            .where('eval_cases.suite_id', '=', suiteId)
            .selectAll()
            .orderBy('eval_cases.created_at', 'asc')
            .execute(),
      ),
      DatabaseError.tryTask,
      TE.map(A.map(row => camelcaseKeys(row) as EvalCaseTableRow)),
    );
  };
}

@injectable()
export class EvalRunsRepo extends createProtectedDatabaseRepo('eval_runs') {
  create = ({ forwardTransaction, value }: TransactionalAttrs<{
    value: { suiteId: TableId; aiModelId: TableId; };
  }>) => this.baseRepo.create({
    forwardTransaction,
    value: {
      ...value,
      status: 'pending' as EvalRunStatus,
    },
  });

  updateStatus = ({ forwardTransaction, id, status }: TransactionalAttrs<{ id: TableId; status: EvalRunStatus; }>) => {
    const transaction = tryReuseTransactionOrSkip({ db: this.db, forwardTransaction });

    return pipe(
      transaction(
        async qb =>
          qb
            .updateTable(this.table)
            .set({ status })
            .where('id', '=', id)
            .returningAll()
            .executeTakeFirstOrThrow(),
      ),
      DatabaseError.tryTask,
      TE.map(row => camelcaseKeys(row) as EvalRunTableRow),
    );
  };

  findById = ({ forwardTransaction, id }: TransactionalAttrs<{ id: TableId; }>) => {
    const transaction = tryReuseTransactionOrSkip({ db: this.db, forwardTransaction });

    return pipe(
      transaction(
        async qb =>
          qb
            .selectFrom(this.table)
            .where('eval_runs.id', '=', id)
            .selectAll()
            .executeTakeFirst(),
      ),
      DatabaseError.tryTask,
      TE.chainW(row =>
        row
          ? TE.right(camelcaseKeys(row) as EvalRunTableRow)
          : TE.left(new DatabaseRecordNotExists({})),
      ),
    );
  };

  findBySuiteId = ({ forwardTransaction, suiteId }: TransactionalAttrs<{ suiteId: TableId; }>) => {
    const transaction = tryReuseTransactionOrSkip({ db: this.db, forwardTransaction });

    return pipe(
      transaction(
        async qb =>
          qb
            .selectFrom(this.table)
            .where('eval_runs.suite_id', '=', suiteId)
            .selectAll()
            .orderBy('eval_runs.created_at', 'desc')
            .execute(),
      ),
      DatabaseError.tryTask,
      TE.map(A.map(row => camelcaseKeys(row) as EvalRunTableRow)),
    );
  };
}

@injectable()
export class EvalResultsRepo extends createProtectedDatabaseRepo('eval_results') {
  create = ({ forwardTransaction, value }: TransactionalAttrs<{
    value: {
      runId: TableId;
      caseId: TableId;
      aiResponse?: string | null;
      latencyMs?: number | null;
      errorMessage?: string | null;
    };
  }>) => this.baseRepo.create({ forwardTransaction, value });

  findByRunId = ({ forwardTransaction, runId }: TransactionalAttrs<{ runId: TableId; }>) => {
    const transaction = tryReuseTransactionOrSkip({ db: this.db, forwardTransaction });

    return pipe(
      transaction(
        async qb =>
          qb
            .selectFrom(this.table)
            .where('eval_results.run_id', '=', runId)
            .selectAll()
            .orderBy('eval_results.created_at', 'asc')
            .execute(),
      ),
      DatabaseError.tryTask,
      TE.map(A.map(row => camelcaseKeys(row) as EvalResultTableRow)),
    );
  };
}
