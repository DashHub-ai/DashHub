import type {
  SdkOffsetPaginationInputT,
  SdkOffsetPaginationOutputT,
} from '@llm/sdk';

import { format } from '@llm/commons';
import { useForwardedI18n } from '~/i18n';

import { getTotalPages } from './helpers';

type Props = {
  pagination: SdkOffsetPaginationInputT;
  result: SdkOffsetPaginationOutputT<unknown>;
};

export function PageNumber({ pagination, result }: Props) {
  const t = useForwardedI18n().pack.pagination;
  const totalPages = getTotalPages(result.total, pagination.limit);

  return (
    <span className="text-sm font-medium">
      {format(t.pageNthOfTotal, {
        page: Math.max(1, Math.ceil(pagination.offset / result.total + 1)),
        total: totalPages,
      })}
    </span>
  );
}
