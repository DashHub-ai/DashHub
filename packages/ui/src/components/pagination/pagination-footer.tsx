import { controlled } from '@under-control/forms';

import type { SdkOffsetPaginationInputT, SdkOffsetPaginationOutputT } from '@llm/sdk';

import { format } from '@llm/commons';
import { useForwardedI18n } from '~/i18n';

import { PageNumber } from './page-number';
import { PaginationArrows } from './pagination-arrows';
import { PaginationItemsPerPage } from './pagination-items-per-page';

export type PaginationFooterProps = {
  result: SdkOffsetPaginationOutputT<unknown>;
  withNthToNthOf?: boolean;
  withPageSizeSelector?: boolean;
};

export const PaginationFooter = controlled<SdkOffsetPaginationInputT, PaginationFooterProps>((
  {
    control: { bind, value },
    result,
    withNthToNthOf = true,
    withPageSizeSelector = true,
  },
) => {
  const t = useForwardedI18n().pack.pagination;

  return (
    <div className="flex flex-wrap justify-between items-center mt-6 px-2">
      {withNthToNthOf && (
        <div className="flex-1 text-muted-foreground text-sm whitespace-nowrap">
          {format(t.showNthToNthOf, {
            from: value.offset + 1,
            to: Math.min(result.total, value.offset + result.items.length),
            total: result.total,
          })}
        </div>
      )}

      <div className="flex flex-none items-center space-x-8">
        {withPageSizeSelector && (
          <PaginationItemsPerPage {...bind.path('limit')} />
        )}
        <PageNumber result={result} pagination={value} />
        <PaginationArrows
          {...bind.entire()}
          result={result}
        />
      </div>
    </div>
  );
});
