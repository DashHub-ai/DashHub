import { useControlStrict } from '@under-control/forms';
import clsx from 'clsx';
import { type KeyboardEventHandler, useState } from 'react';

import { useOutsideClickRef, useUpdateEffect } from '@dashhub/commons-front';

import { SearchResults } from './results';
import { SearchBarInput } from './search-bar-input';

type Props = {
  disabled?: boolean;
};

export function SearchBar({ disabled }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const phrase = useControlStrict<string>({
    defaultValue: '',
  });

  const onInputKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    switch (event.key) {
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };
  const outsideClickRef = useOutsideClickRef<HTMLDivElement>(() => {
    setIsOpen(false);
  });

  useUpdateEffect(() => {
    setIsOpen(phrase.value !== '');
  }, [phrase.value]);

  return (
    <div
      className={clsx(
        'relative uk-navbar-item',
        disabled && 'opacity-50 pointer-events-none',
      )}
      ref={outsideClickRef}
    >
      <div className="uk-custom-select">
        <SearchBarInput
          {...phrase.bind.entire()}
          isExpanded={isOpen}
          onKeyDown={onInputKeyDown}
          onClick={() => {
            if (phrase.value !== '') {
              setIsOpen(true);
            }
          }}
        />

        {isOpen && (
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto uk-drop uk-dropdown uk-open">
            <SearchResults phrase={phrase.value} />
          </div>
        )}
      </div>
    </div>
  );
}
