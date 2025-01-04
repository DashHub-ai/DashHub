import esb from 'elastic-builder';
import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type { SdkPermissionT } from '@llm/sdk';
import type { TableId, TableUuid } from '~/modules/database';

import { tryGetFirstRawResponseHitOrNotExists } from '~/modules/elasticsearch/helpers';

import type { PermissionResourceType } from '../permissions.tables';

import {
  type PermissionsEsDocument,
  PermissionsEsIndexRepo,
} from './permissions-es-index.repo';

@injectable()
export class PermissionsEsSearchRepo {
  constructor(
    @inject(PermissionsEsIndexRepo) private readonly indexRepo: PermissionsEsIndexRepo,
  ) {}

  getByResourceId = (type: PermissionResourceType, id: TableId | TableUuid) => pipe(
    this.indexRepo.search(
      esb
        .requestBodySearch()
        .query(
          esb
            .boolQuery()
            .must(esb.termQuery(`${type}.id`, id)),
        )
        .toJSON(),
    ),
    tryGetFirstRawResponseHitOrNotExists,
    TE.map(doc => PermissionsEsSearchRepo.mapOutputHit(doc._source as PermissionsEsDocument)),
  );

  private static mapOutputHit = (source: PermissionsEsDocument): SdkPermissionT => {
    const record = {
      id: source.id,
      createdAt: source.created_at,
      updatedAt: source.updated_at,
      accessLevel: source.access_level,
      resource: {
        project: source.project,
        app: source.app,
        chat: source.chat,
      },
    };

    if (source.user) {
      return {
        ...record,
        target: {
          group: null,
          user: source.user,
        },
      };
    }

    return {
      ...record,
      target: {
        group: source.group!,
        user: null,
      },
    };
  };
}
