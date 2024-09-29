/* eslint-disable ts/consistent-type-definitions, ts/no-namespace */

import { type ControlBindProps, controlled } from '@under-control/forms';
import clsx from 'clsx';
import {
  type PropsWithChildren,
  type ReactNode,
  useRef,
  useState,
} from 'react';

import { useOutsideClickRef } from '@llm/commons-front';
import { SelectExpandSVG } from '~/icons';

export type SelectItem = {
  id: string | number;
  name?: ReactNode;
};

type Props = ControlBindProps<SelectItem> & PropsWithChildren & {
  className?: string;
  buttonClassName?: string;
  dropdownClassName?: string;
  items: Array<SelectItem>;
};

export const Select = controlled<SelectItem | null, Props>((
  {
    className,
    buttonClassName,
    dropdownClassName,
    items,
    control: {
      value,
      setValue,
    },
  },
) => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const outsideClickRef = useOutsideClickRef<HTMLButtonElement>((event) => {
    if (!dropdownRef.current?.contains(event.target as Node)) {
      setIsOpen(false);
    }
  });

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
          {value?.name}
        </span>
        <SelectExpandSVG />
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className={clsx(
            'uk-drop uk-dropdown uk-open',
            dropdownClassName,
          )}
          tabIndex={-1}
        >
          <hr className="uk-hr" />
          <ul className="uk-dropdown-nav" tabIndex={-1}>
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
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
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
