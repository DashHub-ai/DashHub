/* eslint-disable ts/consistent-type-definitions, ts/no-namespace */

import { type ControlBindProps, controlled } from '@under-control/forms';
import clsx from 'clsx';
import {
  type PropsWithChildren,
  type ReactNode,
  useRef,
  useState,
} from 'react';

import { FAKE_OBJECT_ID, isObjectWithFakeID } from '@llm/commons';
import { useOutsideClickRef, useUpdateEffect } from '@llm/commons-front';
import { useI18n } from '~/i18n';
import { SelectExpandSVG, UkIcon } from '~/icons';

import { HiddenRequiredInput } from './hidden-required-input';

export type SelectItem<I extends string | number = string | number> = {
  id: I;
  name: string;
};

export function createFakeSelectItem(name: string = ''): SelectItem<number> {
  return {
    id: FAKE_OBJECT_ID,
    name,
  };
}

export type SelectProps =
  & ControlBindProps<SelectItem>
  & PropsWithChildren
  & {
    required?: boolean;
    placeholder?: string;
    toolbar?: ReactNode;
    className?: string;
    buttonClassName?: string;
    dropdownClassName?: string;
    items: Array<SelectItem>;
    prependItems?: ReactNode;
    onOpenChanged?: (isOpen: boolean) => void;
  };

export const Select = controlled<SelectItem | null, SelectProps>((
  {
    required,
    placeholder,
    toolbar,
    className,
    buttonClassName,
    dropdownClassName,
    items,
    prependItems,
    onOpenChanged,
    control: {
      value,
      setValue,
    },
  },
) => {
  const { pack } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const outsideClickRef = useOutsideClickRef<HTMLButtonElement>((event) => {
    if (!dropdownRef.current?.contains(event.target as Node)) {
      setIsOpen(false);
    }
  });

  useUpdateEffect(() => {
    onOpenChanged?.(isOpen);
  }, [isOpen]);

  const onInputKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    switch (event.key) {
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const dropdown = isOpen && (
    <div
      ref={dropdownRef}
      className={clsx(
        'uk-drop uk-dropdown uk-open',
        dropdownClassName,
      )}
      tabIndex={-1}
      onKeyDown={onInputKeyDown}
    >
      {toolbar}
      <hr className="uk-hr" />
      <ul className="uk-dropdown-nav" tabIndex={-1}>
        {prependItems}
        {items.map(item => (
          <li
            key={item.id}
            tabIndex={-1}
            className={clsx(
              item.id === value?.id && 'uk-active',
            )}
          >
            <a
              tabIndex={-1}
              onClick={() => {
                setIsOpen(false);
                setValue({
                  value: item,
                });
              }}
            >
              <span>{item.name}</span>
              {item.id === value?.id && (
                <UkIcon icon="check" />
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );

  const isFilled = value && !isObjectWithFakeID(value);
  const displayValue = (
    isFilled
      ? value.name
      : (
          <span className="uk-text-muted">
            {placeholder ?? pack.placeholders.selectItem}
          </span>
        )
  );

  return (
    <div className={clsx('uk-custom-select', className)}>
      <button
        ref={outsideClickRef}
        type="button"
        className={clsx(
          'uk-input-fake uk-flex uk-flex-between',
          buttonClassName,
        )}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <span className="mr-2">
          {displayValue}
        </span>
        <SelectExpandSVG />
      </button>
      {required && <HiddenRequiredInput isFilled={isFilled} />}
      {dropdown}
    </div>
  );
});

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'uk-select': any;
    }
  }
}
