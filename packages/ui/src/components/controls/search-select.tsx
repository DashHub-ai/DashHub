import {
  controlled,
  type OmitControlStateAttrs,
  useControlStrict,
} from '@under-control/forms';
import * as A from 'fp-ts/lib/Array';
import { pipe } from 'fp-ts/lib/function';
import { useRef, useState } from 'react';

import { type CanBePromise, isObjectWithFakeID, rejectById } from '@llm/commons';
import { useAsyncDebounce, useAsyncValue, useUpdateEffect } from '@llm/commons-front';
import { useForwardedI18n } from '~/i18n';
import { UkIcon } from '~/icons';

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
    limit?: number;
    onFetchItems: (attrs: SearchSelectFetchAttrs) => CanBePromise<SelectItem[]>;
  };

export const SearchSelect = controlled<SelectItem | null, SearchSelectProps>((
  {
    limit = 20,
    control: { bind, value },
    onFetchItems,
    ...props
  },
) => {
  const { pack } = useForwardedI18n();

  const [wasOpened, setWasOpened] = useState(false);
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

      return onDebouncedFetchItems({
        limit,
        ...phrase.value?.trim() && {
          phrase: phrase.value,
        },
      });
    },
    [phrase.value, wasOpened],
  );

  const onOpenChanged = (isOpen: boolean) => {
    if (isOpen) {
      searchInputRef.current?.focus();
      setWasOpened(true);
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
    if (result.status !== 'success') {
      return [];
    }

    if (value && !isObjectWithFakeID(value)) {
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
      toolbar={(
        <div className="uk-custom-select-search">
          <UkIcon icon="search" />
          <input
            ref={searchInputRef}
            placeholder={pack.placeholders.search}
            type="text"
            {...phrase.bind.entire()}
          />
        </div>
      )}
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
