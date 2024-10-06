import { z } from 'zod';

import { isNil } from '@llm/commons';

import { SdkTableRowWithIdNameV } from './sdk-table-row-with-id-name.dto';

export const SdkIdNameUrlEntryV = z
  .string()
  .transform((value) => {
    const [, id, name] = value.match(/^(\d+):(.*)$/) ?? [];

    if (isNil(id) || isNil(name)) {
      return undefined;
    }

    return {
      id: Number(id),
      name,
    };
  })
  .pipe(SdkTableRowWithIdNameV);

export type SdkIdNameUrlEntryT = z.infer<typeof SdkIdNameUrlEntryV>;

export function serializeSdkIdNameUrlEntry(value: SdkIdNameUrlEntryT): string {
  return `${value.id}:${value.name}`;
}
