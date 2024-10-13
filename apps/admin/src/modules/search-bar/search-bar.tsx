import { useControlStrict } from '@under-control/forms';
import { useState } from 'react';

import { useOutsideClickRef, useUpdateEffect } from '@llm/commons-front';

import { SearchResults } from './results';
import { SearchBarInput } from './search-bar-input';

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const phrase = useControlStrict<string>({
    defaultValue: '',
  });

  const onInputKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
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
      className="uk-navbar-item relative"
      ref={outsideClickRef}
    >
      <div className="uk-custom-select  w-[150px] lg:w-[270px]">
        <SearchBarInput
          {...phrase.bind.entire()}
          onKeyDown={onInputKeyDown}
          onClick={() => {
            if (phrase.value !== '') {
              setIsOpen(true);
            }
          }}
        />

        {isOpen && (
          <div className="uk-drop uk-dropdown uk-open">
            <SearchResults phrase={phrase.value} />
          </div>
        )}
      </div>
    </div>
  );
}
