import esb from 'elastic-builder';
import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type { SdkProjectPolicyT } from '@llm/sdk';
import type { TableId } from '~/modules/database';

import { tryGetFirstRawResponseHitOrNotExists } from '~/modules/elasticsearch/helpers';

import {
  type ProjectsPoliciesEsDocument,
  ProjectsPoliciesEsIndexRepo,
} from './projects-policies-es-index.repo';

@injectable()
export class ProjectsPoliciesEsSearchRepo {
  constructor(
    @inject(ProjectsPoliciesEsIndexRepo) private readonly indexRepo: ProjectsPoliciesEsIndexRepo,
  ) {}

  getByProjectId = (projectId: TableId) => pipe(
    this.indexRepo.search(
      esb
        .requestBodySearch()
        .query(
          esb
            .boolQuery()
            .must(esb.termQuery('project.id', projectId)),
        )
        .toJSON(),
    ),
    tryGetFirstRawResponseHitOrNotExists,
    TE.map(doc => ProjectsPoliciesEsSearchRepo.mapOutputHit(doc._source as ProjectsPoliciesEsDocument)),
  );

  private static mapOutputHit = (source: ProjectsPoliciesEsDocument): SdkProjectPolicyT => {
    const record = {
      id: source.id,
      createdAt: source.created_at,
      updatedAt: source.updated_at,
      project: source.project,
      user: null,
      group: null,
    };

    if (source.user) {
      return {
        ...record,
        user: source.user,
      };
    }

    return {
      ...record,
      group: source.group!,
    };
  };
}
