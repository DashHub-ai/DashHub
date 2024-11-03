import { type ControlledControlStateAttrs, useControlStrict } from '@under-control/forms';

import type {
  SdkOffsetPaginationInputT,
  SdkOffsetPaginationOutputT,
  SdkTableRowWithIdT,
} from '@llm/sdk';

import { PaginationFooter } from '../pagination';
import { SpinnerContainer } from '../spinner-container';
import { Table, type Props as TableProps } from './table';

type Props<
  I extends SdkTableRowWithIdT,
  P extends SdkOffsetPaginationInputT,
> =
  & Omit<TableProps<I>, 'items'>
  & {
    loading: boolean;
    result?: SdkOffsetPaginationOutputT<I> | null;
    pagination: ControlledControlStateAttrs<P>;
  };

export function PaginatedTable<
  I extends SdkTableRowWithIdT,
  P extends SdkOffsetPaginationInputT,
>({ result, loading, pagination, ...props }: Props<I, P>) {
  const { bind } = useControlStrict<SdkOffsetPaginationInputT>(
    pagination as unknown as ControlledControlStateAttrs<SdkOffsetPaginationInputT>,
  );

  return (
    <SpinnerContainer loading={loading}>
      {() => result && (
        <>
          <Table
            items={result.items}
            {...props}
          />

          <PaginationFooter
            result={result}
            {...bind.entire()}
          />
        </>
      )}
    </SpinnerContainer>
  );
}
