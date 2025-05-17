import type { ReactNode } from 'react';

import { type ControlBindProps, controlled } from '@under-control/forms';
import clsx from 'clsx';
import { useState } from 'react';

import type { SdkTableRowIdT } from '@dashhub/sdk';

import { useI18n } from '~/i18n';

import { SelectableBadgeItem } from './selectable-badge-item';

export type SelectBadgeItem = {
  id: SdkTableRowIdT;
  name: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
};

export type SelectableBadgesProps = ControlBindProps<SdkTableRowIdT[]> & {
  className?: string;
  items: Array<SelectBadgeItem>;
  prefix?: ReactNode;
  multiSelect?: boolean;
  visibilityLimit?: number;
};

export const SelectableBadges = controlled<SdkTableRowIdT[], SelectableBadgesProps>((
  {
    control: { value, setValue },
    prefix,
    items,
    className,
    multiSelect = false,
    visibilityLimit,
  },
) => {
  const t = useI18n().pack;
  const [isExpanded, setIsExpanded] = useState(false);
  const isSelected = (id: SdkTableRowIdT) => value.includes(id);

  const onItemClick = (id: SdkTableRowIdT, disabled?: boolean) => (event: React.MouseEvent) => {
    event.preventDefault();

    if (disabled) {
      return;
    }

    if (multiSelect) {
      if (isSelected(id)) {
        setValue({
          value: value.filter(itemId => itemId !== id),
        });
      }
      else {
        setValue({
          value: [...value, id],
        });
      }
    }
    else {
      setValue({
        value: isSelected(id) ? [] : [id],
      });
    }
  };

  const displayItems = visibilityLimit && !isExpanded && items.length > visibilityLimit
    ? items.slice(0, visibilityLimit)
    : items;

  const toggleExpansion = () => setIsExpanded(prev => !prev);

  return (
    <div className={clsx('flex flex-wrap gap-2', className)}>
      {prefix}

      {displayItems.map(({ id, name, icon, disabled }) => (
        <SelectableBadgeItem
          key={String(id)}
          name={name}
          icon={icon}
          disabled={disabled}
          isSelected={isSelected(id)}
          onClick={onItemClick(id, disabled)}
        />
      ))}

      {visibilityLimit && items.length > visibilityLimit && (
        <div
          className={clsx(
            'px-3 py-1 rounded-full transition-all cursor-pointer',
            'border border-gray-200 text-sm bg-white text-gray-700 hover:bg-gray-100',
          )}
          onClick={toggleExpansion}
          role="button"
        >
          <div className="flex items-center gap-1">
            <span>{t.buttons.expand[isExpanded ? 'less' : 'more']}</span>
          </div>
        </div>
      )}
    </div>
  );
});
