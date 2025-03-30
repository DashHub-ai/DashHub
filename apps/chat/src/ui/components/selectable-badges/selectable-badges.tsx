import type { ReactNode } from 'react';

import { type ControlBindProps, controlled } from '@under-control/forms';
import clsx from 'clsx';
import { useState } from 'react';

import type { SdkTableRowIdT } from '@llm/sdk';

import { useI18n } from '~/i18n';

export type SelectBadgeItem = {
  id: SdkTableRowIdT;
  name: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
};

export type SelectableBadgesProps = ControlBindProps<SdkTableRowIdT[]> & {
  className?: string;
  items: Array<SelectBadgeItem>;
  multiSelect?: boolean;
  visibilityLimit?: number;
};

export const SelectableBadges = controlled<SdkTableRowIdT[], SelectableBadgesProps>((
  {
    control: { value, setValue },
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
      {displayItems.map(({ id, name, icon, disabled }) => (
        <div
          key={String(id)}
          className={clsx(
            'px-3 py-1 rounded-full transition-all cursor-pointer',
            'border border-gray-200 text-sm',
            {
              'bg-primary text-white border-primary': isSelected(id),
              'bg-white text-gray-700 hover:bg-gray-100': !isSelected(id),
              'opacity-50 cursor-not-allowed': disabled,
            },
          )}
          onClick={onItemClick(id, disabled)}
          role="button"
          aria-pressed={isSelected(id)}
          aria-disabled={disabled}
        >
          <div className="flex items-center gap-1">
            {icon && <span className="flex items-center">{icon}</span>}
            <span>{name}</span>
          </div>
        </div>
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
