import {
  controlled,
  type OmitControlStateAttrs,
  useControlStrict,
} from '@under-control/forms';
import * as A from 'fp-ts/lib/Array';
import { pipe } from 'fp-ts/lib/function';
import { SearchIcon } from 'lucide-react';
import { useRef, useState } from 'react';

import { type CanBePromise, isObjectWithFakeID, rejectById } from '@dashhub/commons';
import { useAsyncDebounce, useAsyncValue, useUpdateEffect } from '@dashhub/commons-front';
import { useI18n } from '~/i18n';

import { SpinnerContainer } from '../spinner-container';
import { Select, type SelectItem, type SelectProps } from './select';

export type SearchSelectFetchAttrs = {
  limit: number;
  phrase?: string;
};

export type SearchSelectProps =
  & OmitControlStateAttrs<
    Omit<SelectProps, 'toolbar' | 'items' | 'prependItems' | 'onOpenChanged'>
  >
  & {
    preload?: boolean;
    withSearch?: boolean;
    limit?: number;
    onFetchItems: (attrs: SearchSelectFetchAttrs) => CanBePromise<SelectItem[]>;
  };

export const SearchSelect = controlled<SelectItem | null, SearchSelectProps>((
  {
    preload,
    withSearch = true,
    limit = 20,
    control: { bind, value },
    onFetchItems,
    ...props
  },
) => {
  const { pack } = useI18n();

  const [wasOpened, setWasOpened] = useState(!!preload);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const phrase = useControlStrict<string>({
    defaultValue: '',
  });

  const onDebouncedFetchItems = useAsyncDebounce(onFetchItems, {
    delay: 200,
  });

  const result = useAsyncValue(
    async () => {
      if (!wasOpened) {
        return [];
      }

      const trimmedValue = phrase.value?.trim();

      return onDebouncedFetchItems({
        limit,
        ...trimmedValue && {
          phrase: trimmedValue,
        },
      });
    },
    [phrase.value, wasOpened],
  );

  const onOpenChanged = (isOpen: boolean) => {
    if (isOpen) {
      setWasOpened(true);
      searchInputRef.current?.focus();
    }
    else {
      phrase.setValue({
        value: '',
      });
    }
  };

  useUpdateEffect(() => {
    if (phrase.value) {
      phrase.setValue({
        value: '',
      });
    }
  }, [value]);

  const itemsWithSelected = (() => {
    if (!wasOpened || result.status !== 'success') {
      return [];
    }

    if (value && !phrase.value.length && !isObjectWithFakeID(value)) {
      return pipe(
        result.data,
        rejectById(value.id),
        A.prepend(value),
      );
    }

    return result.data;
  })();

  return (
    <Select
      {...props}
      {...bind.entire()}
      items={itemsWithSelected}
      {...withSearch
        ? {
            toolbar: (
              <div className="uk-custom-select-search">
                <SearchIcon size={16} />
                <input
                  ref={searchInputRef}
                  placeholder={pack.placeholders.search}
                  type="text"
                  {...phrase.bind.entire()}
                />
              </div>
            ),
          }
        : {}}
      {...result.status === 'loading' && {
        prependItems: (
          <div className="flex justify-center w-full">
            <SpinnerContainer scale={0.7} />
          </div>
        ),
      }}
      onOpenChanged={onOpenChanged}
    />
  );
});
