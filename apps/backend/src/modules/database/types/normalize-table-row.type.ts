import type { Insertable, Selectable, Updateable } from 'kysely';

import type { SnakeCaseToCamelCaseObject } from '@llm/commons';

export type NormalizeSelectTableRow<T> = SnakeCaseToCamelCaseObject<
  Selectable<T>
>;

export type NormalizeInsertTableRow<T> = SnakeCaseToCamelCaseObject<
  Insertable<T>
>;

export type NormalizeUpdateTableRow<T> = SnakeCaseToCamelCaseObject<
  Updateable<T>
>;
