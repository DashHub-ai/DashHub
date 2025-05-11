import { z } from 'zod';

import { isNil } from '@dashhub/commons';

import type { SdkTableRowIdT } from './sdk-table-row-id.dto';

import { SdkTableRowWithIdNameV } from './sdk-table-row-with-id-name.dto';

export const SdkIdNameUrlEntryV = z
  .custom<SdkIdNameUrlSerializedEntryT>(
    value => typeof value === 'string'
      ? /^\d+:.*$/.test(value)
      : false,
  )
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

export type SdkIdNameUrlSerializedEntryT = `${SdkTableRowIdT}:${string}`;

export type SdkIdNameUrlEntryT = z.infer<typeof SdkIdNameUrlEntryV>;

export function serializeSdkIdNameUrlEntry(value: SdkIdNameUrlEntryT): SdkIdNameUrlSerializedEntryT {
  return `${value.id}:${value.name}`;
}
