import { useRef } from 'react';

import { useAfterMount, useTimeout } from '@dashhub/commons-front';

export function useAutoFocusConversationInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const isNearBottom = (threshold = 100) => {
    const container = messagesContainerRef.current;
    if (!container) {
      return true;
    }

    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    return distanceFromBottom <= threshold;
  };

  const scrollConversation = (forceScroll = true) => {
    if (!messagesContainerRef.current) {
      return;
    }

    if (forceScroll || isNearBottom()) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'instant',
      });
    }
  };

  const focusInput = (forceScroll = false) => {
    scrollConversation(forceScroll);
    inputRef.current?.focus();
  };

  useTimeout(() => scrollConversation(), { time: 500 });
  useAfterMount(() => focusInput(true));

  return {
    inputRef,
    messagesContainerRef,
    focusInput,
    scrollConversation,
    isNearBottom,
  };
}
