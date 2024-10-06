import {
  controlled,
  type OmitControlStateAttrs,
  useControlStrict,
} from '@under-control/forms';
import { useRef } from 'react';

import type { CanBePromise } from '@llm/commons';

import { useAsyncDebounce, useAsyncValue, useUpdateEffect } from '@llm/commons-front';
import { useI18n } from '~/i18n';
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
  const { pack } = useI18n();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const phrase = useControlStrict<string>({
    defaultValue: '',
  });

  const onDebouncedFetchItems = useAsyncDebounce(onFetchItems, {
    delay: 200,
  });

  const result = useAsyncValue(
    () => onDebouncedFetchItems({
      limit,
      ...phrase.value?.trim() && {
        phrase: phrase.value,
      },
    }),
    [phrase.value],
  );

  const onOpenChanged = (isOpen: boolean) => {
    if (isOpen) {
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

  return (
    <Select
      {...props}
      {...bind.entire()}
      items={
        result.status === 'success'
          ? result.data
          : []
      }
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
