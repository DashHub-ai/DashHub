import type {
  SdkOffsetPaginationInputT,
  SdkOffsetPaginationOutputT,
} from '@llm/sdk';

import { format } from '@llm/commons';
import { useI18n } from '~/i18n';

import { getTotalPages } from './helpers';

type Props = {
  pagination: SdkOffsetPaginationInputT;
  result: SdkOffsetPaginationOutputT<unknown>;
};

export function PageNumber({ pagination, result }: Props) {
  const t = useI18n().pack.pagination;
  const totalPages = getTotalPages(result.total, pagination.limit);

  return (
    <span className="text-sm font-medium">
      {format(t.pageNthOfTotal, {
        page: Math.max(1, pagination.offset / result.total + 1),
        total: totalPages,
      })}
    </span>
  );
}
