import { useControlStrict } from '@under-control/forms';
import { flow } from 'fp-ts/lib/function';
import { useEffect, useRef, useState } from 'react';

import { runTask, tryOrThrowTE } from '@llm/commons';
import {
  useAsyncDebounce,
  useAsyncValue,
  useOutsideClickRef,
  useUpdateEffect,
  useWindowListener,
} from '@llm/commons-front';
import { useSdkForLoggedIn } from '@llm/sdk';
import { useI18n } from '~/i18n';
import { useWorkspaceOrganizationOrThrow } from '~/modules/workspace';

import { DropdownContent } from './dropdown-content';

export function SearchUsersGroupsInput() {
  const t = useI18n().pack.permissions.modal.autocomplete;
  const { sdks } = useSdkForLoggedIn();
  const { organization } = useWorkspaceOrganizationOrThrow();

  const [isOpened, setIsOpened] = useState(false);
  const phrase = useControlStrict<string>({
    defaultValue: '',
  });

  const onDebouncedFetchItems = useAsyncDebounce(
    flow(
      sdks.dashboard.shareResource.searchUsersAndGroups,
      tryOrThrowTE,
      runTask,
    ),
    {
      delay: 100,
    },
  );

  const result = useAsyncValue(
    async () => {
      if (!phrase.value) {
        return null;
      }

      return onDebouncedFetchItems(
        {
          phrase: phrase.value,
          organizationId: organization.id,
        },
      );
    },
    [phrase.value],
  );

  const outsideClickRef = useOutsideClickRef<HTMLDivElement>(() => {
    phrase.setValue({
      value: '',
    });
  });

  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const inputRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();

      setPosition({
        top: rect.top + rect.height + window.scrollY + 5,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  useWindowListener({
    resize: updatePosition,
    scroll: updatePosition,
  });

  useEffect(updatePosition, [isOpened]);
  useUpdateEffect(() => {
    setIsOpened(phrase.value.length > 0);
  }, [phrase]);

  const handleSelect = () => {
    phrase.setValue({ value: '' });
  };

  return (
    <div ref={outsideClickRef}>
      <div className="relative" ref={inputRef}>
        <input
          type="text"
          className="w-full uk-input"
          placeholder={t.placeholder}
          {...phrase.bind.entire()}
        />

        {result.status === 'loading' && (
          <span
            className="top-1/2 right-2 absolute -translate-y-1/2 uk-icon uk-spinner"
            role="status"
            uk-spinner="ratio: 0.54"
          />
        )}
      </div>

      {isOpened && (
        <DropdownContent
          result={result}
          style={{
            position: 'absolute',
            zIndex: 9999,
            top: `${position.top}px`,
            left: `${position.left}px`,
            width: `${position.width}px`,
          }}
          onSelect={handleSelect}
        />
      )}
    </div>
  );
}
