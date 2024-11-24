import { useLayoutEffect, useRef } from 'react';

import { useAfterMount } from '@llm/commons-front';

export function useAutoFocusConversationInput(key: unknown) {
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const focusInput = () => {
    messagesContainerRef.current?.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: 'smooth',
    });

    inputRef.current?.focus();
  };

  useAfterMount(focusInput);
  useLayoutEffect(focusInput, [key]);

  return {
    inputRef,
    messagesContainerRef,
  };
}
