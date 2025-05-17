import esb from 'elastic-builder';

import type { RelaxedId } from '@dashhub/commons';

export function createSortByIdsOrderScript(ids: RelaxedId[]) {
  return (
    esb
      .sort()
      .script(
        esb
          .script('inline', 'int i = params.ids.indexOf(doc[\'id\'].value.toString()); return i >= 0 ? i : params.ids.size();')
          .params({ ids: ids.map(String) }),
      )
      .type('number')
  );
}
