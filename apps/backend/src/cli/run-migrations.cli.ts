import 'reflect-metadata';

import { parseArgs } from 'node:util';

import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { container } from 'tsyringe';

import { runTaskAsVoid, tryOrThrowTE } from '@llm/commons';
import { DatabaseConnectionRepo, DatabaseMigrateService } from '~/modules/database';

const {
  values: { down },
} = parseArgs({
  options: {
    down: {
      type: 'boolean',
      short: 'd',
    },
  },
});

const databaseConnectionRepo = container.resolve(DatabaseConnectionRepo);
const migrator = container.resolve(DatabaseMigrateService);

void pipe(
  migrator.run(down ? 'down' : 'up'),
  TE.chainW(() => databaseConnectionRepo.close),
  tryOrThrowTE,
  runTaskAsVoid,
);
