import esb from 'elastic-builder';
import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type { SdkPermissionResourceT, SdkPermissionT } from '@llm/sdk';

import { tryGetFirstRawResponseHitOrNotExists } from '~/modules/elasticsearch/helpers';

import {
  type PermissionsEsDocument,
  PermissionsEsIndexRepo,
} from './permissions-es-index.repo';

@injectable()
export class PermissionsEsSearchRepo {
  constructor(
    @inject(PermissionsEsIndexRepo) private readonly indexRepo: PermissionsEsIndexRepo,
  ) {}

  getByResource = ({ type, id }: SdkPermissionResourceT) => pipe(
    this.indexRepo.search(
      esb
        .requestBodySearch()
        .query(
          esb
            .boolQuery()
            .must(esb.termQuery(`${type}.id`, id)),
        )
        .size(1)
        .toJSON(),
    ),
    tryGetFirstRawResponseHitOrNotExists,
    TE.map(doc => PermissionsEsSearchRepo.mapOutputHit(doc._source as PermissionsEsDocument)),
  );

  private static mapOutputHit = (source: PermissionsEsDocument): SdkPermissionT => {
    const resource: SdkPermissionResourceT = (() => {
      if (source.project) {
        return {
          type: 'project',
          id: source.project.id,
        };
      }

      if (source.app) {
        return {
          type: 'app',
          id: source.app.id,
        };
      }

      return {
        type: 'chat',
        id: source.chat!.id,
      };
    })();

    const record = {
      id: source.id,
      createdAt: source.created_at,
      updatedAt: source.updated_at,
      accessLevel: source.access_level,
      resource,
    };

    if (source.user) {
      return {
        ...record,
        target: {
          user: source.user,
        },
      };
    }

    return {
      ...record,
      target: {
        group: source.group!,
      },
    };
  };
}
