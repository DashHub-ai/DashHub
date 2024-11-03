import { controlled } from '@under-control/forms';

import type { SdkOffsetPaginationInputT, SdkOffsetPaginationOutputT } from '@llm/sdk';

import { format } from '@llm/commons';
import { useForwardedI18n } from '~/i18n';

import { PageNumber } from './page-number';
import { PaginationArrows } from './pagination-arrows';
import { PaginationItemsPerPage } from './pagination-items-per-page';

type Props = {
  result: SdkOffsetPaginationOutputT<unknown>;
};

export const PaginationFooter = controlled<SdkOffsetPaginationInputT, Props>((
  {
    control: { bind, value },
    result,
  },
) => {
  const t = useForwardedI18n().pack.pagination;

  return (
    <div className="mt-4 flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {format(t.showNthToNthOf, {
          from: value.offset + 1,
          to: Math.min(result.total, value.offset + result.items.length),
          total: result.total,
        })}
      </div>

      <div className="flex flex-none items-center space-x-8">
        <PaginationItemsPerPage {...bind.path('limit')} />
        <PageNumber result={result} pagination={value} />
        <PaginationArrows
          {...bind.entire()}
          result={result}
        />
      </div>
    </div>
  );
});
