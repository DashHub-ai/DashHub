import { controlled } from '@under-control/inputs';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';

import {
  type RequiredOnlyBy,
  runTask,
  tryOrThrowTE,
} from '@llm/commons';
import {
  type SdkContextT,
  type SdkInferOffsetPaginationItemType,
  type SdkOffsetPaginationOutputT,
  type SdkOmitOffsetPaginationInputT,
  useSdk,
} from '@llm/sdk';

import {
  SearchSelect,
  type SearchSelectFetchAttrs,
  type SearchSelectProps,
  type SelectItem,
} from '../controls';

type SdkAutocompleteInputProps<F> = Omit<
  SearchSelectProps,
  'onFetchItems'
> & {
  filters?: F;
};

type SdkAutocompleteFactoryAttrs<
  I extends SdkOffsetPaginationOutputT<SelectItem>,
  F,
> = {
  fetchFn: (
    attrs: SearchSelectFetchAttrs & {
      sdk: SdkContextT;
      filters?: F;
    }
  ) => TE.TaskEither<any, I>;
};

export function createSdkAutocomplete<
  I extends SdkOffsetPaginationOutputT<SelectItem>,
  F extends object = never,
  FT = SdkOmitOffsetPaginationInputT<
    Omit<F, 'phrase' | 'limit' | 'sort'>
  >,
>({
  fetchFn,
}: SdkAutocompleteFactoryAttrs<I, FT>) {
  return controlled<
    RequiredOnlyBy<SdkInferOffsetPaginationItemType<I>, 'id' | 'name'> | null,
    SdkAutocompleteInputProps<FT>
  >(({ control, filters, ...props }) => {
    const sdk = useSdk();

    const onFetchItems = async (attrs: SearchSelectFetchAttrs) =>
      pipe(
        fetchFn({ ...attrs, sdk, filters }),
        TE.map(({ items }) => items),
        tryOrThrowTE,
        runTask,
      );

    return (
      <SearchSelect
        {...props}
        {...(control.bind.entire() as unknown as any)}
        fetchItemsKeys={[JSON.stringify(filters)]}
        onFetchItems={onFetchItems}
      />
    );
  });
}
