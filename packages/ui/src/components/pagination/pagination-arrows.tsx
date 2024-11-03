import { controlled } from '@under-control/forms';

import type {
  SdkOffsetPaginationInputT,
  SdkOffsetPaginationOutputT,
} from '@llm/sdk';

import { clamp } from '@llm/commons';
import { useForwardedI18n } from '~/i18n';
import { UkIcon } from '~/icons';

import { getTotalPages } from './helpers';

type Props = {
  result: SdkOffsetPaginationOutputT<unknown>;
};

export const PaginationArrows = controlled<SdkOffsetPaginationInputT, Props>(
  ({
    result,
    control: { value, setValue },
  }) => {
    const t = useForwardedI18n().pack.pagination.goto;
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
          className="uk-icon-button uk-icon-button-small hidden lg:inline-flex"
          disabled={!value.offset}
          onClick={() => {
            setOffset(0);
          }}
        >
          <span className="sr-only">
            {t.firstPage}
          </span>

          <span className="size-4">
            <UkIcon icon="chevrons-left" />
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
            <UkIcon icon="chevron-left" />
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
            <UkIcon icon="chevron-right" />
          </span>
        </button>

        <button
          type="button"
          className="uk-icon-button uk-icon-button-small hidden lg:inline-flex"
          disabled={value.offset >= maxOffset}
          onClick={() => {
            setOffset(value.limit * (totalPages - 1));
          }}
        >
          <span className="sr-only">
            {t.lastPage}
          </span>

          <span className="size-4">
            <UkIcon icon="chevrons-right" />
          </span>
        </button>
      </div>
    );
  },
);
