import clsx from 'clsx';
import { EllipsisIcon } from 'lucide-react';

import type { SelectItem } from '../controls';

export type EllipsisDropdownItem = SelectItem & {
  onClick?: VoidFunction;
};

export type EllipsisDropdownButtonProps = {
  className?: string;
  items: EllipsisDropdownItem[];
};

export function EllipsisDropdownButton({ className, items }: EllipsisDropdownButtonProps) {
  return (
    <>
      <button
        type="button"
        className={clsx(
          'uk-icon-button uk-icon-button-xsmall',
          className,
        )}
        aria-haspopup="true"
        aria-expanded="false"
      >
        <span className="size-4">
          <EllipsisIcon size={16} />
        </span>
      </button>

      <div
        className="uk-drop uk-dropdown"
        uk-dropdown="mode: click; pos: bottom-right"
      >
        <ul className="uk-dropdown-nav uk-nav">
          {items.map(item => (
            <li key={item.id}>
              <a
                className="justify-between uk-drop-close"
                type="button"
                href=""
                onClick={item.onClick}
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
