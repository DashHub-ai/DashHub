import type { ReactNode } from 'react';

import { type ControlledControlStateAttrs, useControlStrict } from '@under-control/forms';

import type {
  SdkOffsetPaginationInputT,
  SdkOffsetPaginationOutputT,
  SdkTableRowWithIdT,
  SdkTableRowWithUuidT,
} from '@llm/sdk';

import { PaginationFooter, type PaginationFooterProps } from '../pagination';
import { SpinnerContainer } from '../spinner-container';
import { NoItemsPlaceholder } from './no-items-placeholder';

export type PaginatedListProps<
  I extends SdkTableRowWithIdT | SdkTableRowWithUuidT,
  P extends SdkOffsetPaginationInputT,
> = {
  loading: boolean;
  withEmptyPlaceholder?: boolean;
  result?: SdkOffsetPaginationOutputT<I> | null;
  pagination: ControlledControlStateAttrs<P>;
  footerProps?: Omit<PaginationFooterProps, 'result'>;
  children: (result: SdkOffsetPaginationOutputT<I>) => ReactNode;
};

export function PaginatedList<
  I extends SdkTableRowWithIdT | SdkTableRowWithUuidT,
  P extends SdkOffsetPaginationInputT,
>({ result, footerProps, withEmptyPlaceholder = true, loading, pagination, children }: PaginatedListProps<I, P>) {
  const { bind } = useControlStrict<SdkOffsetPaginationInputT>(
    pagination as unknown as ControlledControlStateAttrs<SdkOffsetPaginationInputT>,
  );

  return (
    <SpinnerContainer loading={loading}>
      {() => result && (
        <>
          {withEmptyPlaceholder && !result.items.length
            ? (
                <NoItemsPlaceholder />
              )
            : children(result)}

          {result.total > 0 && (
            <PaginationFooter
              result={result}
              {...footerProps}
              {...bind.entire()}
            />
          )}
        </>
      )}
    </SpinnerContainer>
  );
}
