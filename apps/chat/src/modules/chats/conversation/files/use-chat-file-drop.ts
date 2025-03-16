import { useFileDrop, type UseFileDropProps } from '@llm/commons-front';

import { ACCEPTED_CHAT_FILE_TYPES } from './select-chat-file';

export function useChatFileDrop(props: Omit<UseFileDropProps, 'acceptedFileTypes'>) {
  return useFileDrop({
    ...props,
    acceptedFileTypes: ACCEPTED_CHAT_FILE_TYPES,
  });
}
