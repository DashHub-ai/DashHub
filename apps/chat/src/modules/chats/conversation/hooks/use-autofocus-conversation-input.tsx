import { useRef } from 'react';

import { useAfterMount } from '@llm/commons-front';

export function useAutoFocusConversationInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollConversation = () => {
    messagesContainerRef.current?.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: 'instant',
    });
  };

  const focusInput = () => {
    scrollConversation();
    inputRef.current?.focus();
  };

  useAfterMount(focusInput);

  return {
    inputRef,
    messagesContainerRef,
    focusInput,
    scrollConversation,
  };
}
