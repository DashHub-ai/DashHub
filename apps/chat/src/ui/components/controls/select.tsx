import { type ControlBindProps, controlled } from '@under-control/forms';
import clsx from 'clsx';
import { CheckIcon } from 'lucide-react';
import {
  type CSSProperties,
  type PropsWithChildren,
  type ReactNode,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { FAKE_OBJECT_ID, isObjectWithFakeID } from '@llm/commons';
import { useOutsideClickRef, useUpdateEffect } from '@llm/commons-front';
import { useI18n } from '~/i18n';
import { SelectExpandSVG } from '~/ui/icons';

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
    prefix?: string | null;
    disabled?: boolean;
    required?: boolean;
    placeholder?: string;
    toolbar?: ReactNode;
    className?: string;
    buttonClassName?: string;
    dropdownClassName?: string;
    placeholderClassName?: string;
    items: Array<SelectItem>;
    prependItems?: ReactNode;
    withBackground?: boolean;
    onOpenChanged?: (isOpen: boolean) => void;
  };

export const Select = controlled<SelectItem | null, SelectProps>((
  {
    prefix,
    disabled,
    required,
    placeholder,
    toolbar,
    className,
    buttonClassName,
    dropdownClassName,
    placeholderClassName,
    items,
    prependItems,
    withBackground = true,
    onOpenChanged,
    control: {
      value,
      setValue,
    },
  },
) => {
  const { pack } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<CSSProperties>({});

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useOutsideClickRef<HTMLButtonElement>((event) => {
    if (!dropdownRef.current?.contains(event.target as Node)) {
      setIsOpen(false);
    }
  });

  useUpdateEffect(() => {
    onOpenChanged?.(isOpen);
  }, [isOpen]);

  useLayoutEffect(() => {
    if (isOpen && dropdownRef.current && buttonRef.current) {
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      if (buttonRect.bottom + dropdownRect.height > viewportHeight) {
        setDropdownStyle({
          transform: `translateY(calc(-100% - ${buttonRect.height + 14}px))`,
        });
      }
      else {
        setDropdownStyle({
          transform: 'none',
        });
      }
    }
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
      style={dropdownStyle}
      tabIndex={-1}
      onKeyDown={onInputKeyDown}
    >
      {toolbar}
      <hr className="uk-hr" />
      <ul className="uk-dropdown-nav" tabIndex={-1}>
        {prependItems}
        {items.map((item) => {
          const isActive = item.id === value?.id;

          return (
            <li
              key={item.id}
              tabIndex={-1}
              className={clsx(
                isActive && 'uk-active',
              )}
            >
              <a
                tabIndex={-1}
                onClick={() => {
                  setIsOpen(false);
                  setValue({
                    value: isActive ? null : item,
                  });
                }}
              >
                <span>{item.name}</span>
                {isActive && (
                  <CheckIcon size={16} />
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );

  const isFilled = value && !isObjectWithFakeID(value);
  const displayValue = (
    isFilled
      ? value.name
      : (
          <span className={placeholderClassName || 'uk-text-muted '}>
            {placeholder ?? pack.placeholders.selectItem}
          </span>
        )
  );

  return (
    <div className={clsx('uk-custom-select', className)}>
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        className={clsx(
          'uk-flex uk-flex-between truncate uk-input-fake',
          withBackground && 'bg-white',
          buttonClassName,
        )}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <div className="flex flex-row flex-1 justify-start truncate">
          {prefix && (!placeholder || isFilled) && (
            <span className={clsx('mr-1', placeholderClassName || 'uk-text-muted ')}>
              {prefix}
              {isFilled ? ':' : ''}
            </span>
          )}

          {(!prefix || isFilled || !!placeholder) && (
            <span className="mr-2 truncate">
              {displayValue}
            </span>
          )}
        </div>

        <SelectExpandSVG />
      </button>
      {required && <HiddenRequiredInput isFilled={isFilled} />}
      {dropdown}
    </div>
  );
});
