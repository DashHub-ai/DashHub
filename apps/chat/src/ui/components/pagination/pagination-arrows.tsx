import { controlled } from '@under-control/forms';
import { ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from 'lucide-react';

import type {
  SdkOffsetPaginationInputT,
  SdkOffsetPaginationOutputT,
} from '@llm/sdk';

import { clamp } from '@llm/commons';
import { useI18n } from '~/i18n';

import { getTotalPages } from './helpers';

type Props = {
  result: SdkOffsetPaginationOutputT<unknown>;
};

export const PaginationArrows = controlled<SdkOffsetPaginationInputT, Props>(
  ({
    result,
    control: { value, setValue },
  }) => {
    const t = useI18n().pack.pagination.goto;
    const setOffset = (offset: number) => {
      setValue({
        merge: true,
        value: {
          offset: clamp(0, result.total, offset),
        },
      });
    };

    const setRelativePageOffset = (relative: number) => {
      setOffset(value.offset + relative * value.limit);
    };

    const maxOffset = Math.max(result.total - value.limit, 0);
    const totalPages = getTotalPages(result.total, value.limit);

    return (
      <div className="flex flex-row space-x-4">
        <button
          type="button"
          className="lg:inline-flex hidden uk-icon-button uk-icon-button-small"
          disabled={!value.offset}
          onClick={() => {
            setOffset(0);
          }}
        >
          <span className="sr-only">
            {t.firstPage}
          </span>

          <span className="size-4">
            <ChevronsLeftIcon size={16} />
          </span>
        </button>

        <button
          type="button"
          className="uk-icon-button uk-icon-button-small"
          disabled={!value.offset}
          onClick={() => {
            setRelativePageOffset(-1);
          }}
        >
          <span className="sr-only">
            {t.previousPage}
          </span>

          <span className="size-4">
            <ChevronsLeftIcon size={16} />
          </span>
        </button>

        <button
          type="button"
          className="uk-icon-button uk-icon-button-small"
          disabled={value.offset >= maxOffset}
          onClick={() => {
            setRelativePageOffset(1);
          }}
        >
          <span className="sr-only">
            {t.nextPage}
          </span>

          <span className="size-4">
            <ChevronRightIcon size={16} />
          </span>
        </button>

        <button
          type="button"
          className="lg:inline-flex hidden uk-icon-button uk-icon-button-small"
          disabled={value.offset >= maxOffset}
          onClick={() => {
            setOffset(value.limit * (totalPages - 1));
          }}
        >
          <span className="sr-only">
            {t.lastPage}
          </span>

          <span className="size-4">
            <ChevronsRightIcon size={16} />
          </span>
        </button>
      </div>
    );
  },
);
