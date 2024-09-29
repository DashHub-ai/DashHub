import { type ControlBindProps, controlled } from '@under-control/forms';
import { useMemo } from 'react';

import { findItemById, uniq } from '@llm/commons';
import { useI18n } from '~/i18n';

import { Select, type SelectItem } from '../controls';

type Props = ControlBindProps<number> & {
  itemsPerPage?: number[];
};

export const PaginationItemsPerPage = controlled<number, Props>(
  ({
    control: { value, setValue },
    itemsPerPage = [10, 20, 30, 40, 50],
  }) => {
    const t = useI18n().pack.pagination;
    const items = useMemo(
      () =>
        uniq([value, ...itemsPerPage])
          .sort((a, b) => a - b)
          .map((item): SelectItem => ({
            id: item,
            name: item,
          })),
      [itemsPerPage],
    );

    return (
      <div className="flex items-center space-x-2">
        <p className="text-sm font-medium">
          {t.itemsPerPage}
        </p>

        <Select
          items={items}
          value={
            findItemById(value)(items)!
          }
          onChange={
            item => setValue({
              value: Number(item?.id ?? itemsPerPage[0]),
            })
          }
        />
      </div>
    );
  },
);
