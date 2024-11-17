import { v4 } from 'uuid';

import {
  type SdkCreateMessageInputT,
  type SdkMessageT,
  useSdkForLoggedIn,
} from '@llm/sdk';

export function useOptimisticResponseCreator() {
  const { session: { token } } = useSdkForLoggedIn();

  return (message: SdkCreateMessageInputT): SdkMessageT => ({
    id: v4(),
    content: message.content,
    role: 'user',
    updatedAt: new Date(),
    createdAt: new Date(),
    creator: {
      id: token.sub,
      email: token.email,
    },
    repeats: [],
  });
}
