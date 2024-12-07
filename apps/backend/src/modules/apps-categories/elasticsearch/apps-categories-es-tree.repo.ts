import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type {
  SdkCountedAppsCategoriesTreeT,
  SdkCountedIdRecordT,
  SdkTableRowIdT,
} from '@llm/sdk';

import { createTreeFromList, withCountedTreeNodes } from '@llm/commons';

import { AppsCategoriesEsSearchRepo } from './apps-categories-es-search.repo';

type CountedTreeCreatorAttrs = {
  organizationIds?: SdkTableRowIdT[];
  countedAggs: SdkCountedIdRecordT[];
};

@injectable()
export class AppsCategoriesEsTreeRepo {
  constructor(
    @inject(AppsCategoriesEsSearchRepo) private readonly searchRepo: AppsCategoriesEsSearchRepo,
  ) {}

  createCountedTree = ({ countedAggs, organizationIds }: CountedTreeCreatorAttrs) => pipe(
    this.searchRepo.search({
      offset: 0,
      limit: 300,
      sort: 'id:asc',
      organizationIds,
      archived: false,
    }),
    TE.map(({ items: categories }): SdkCountedAppsCategoriesTreeT => {
      const tree = createTreeFromList(
        ({ parentCategory }) => parentCategory?.id,
        categories,
      );

      return withCountedTreeNodes(countedAggs, tree);
    }),
  );
}
