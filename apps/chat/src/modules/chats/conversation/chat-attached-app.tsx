import { Bot } from 'lucide-react';
import { memo } from 'react';

import type { SdkTableRowWithIdNameT } from '@llm/sdk';

import { AppChatBadge } from '../../apps/chat/app-chat-badge';

type ChatAttachedAppProps = {
  app: SdkTableRowWithIdNameT;
};

export const ChatAttachedApp = memo(({ app }: ChatAttachedAppProps) => {
  return (
    <div className="flex items-start gap-2 opacity-0 mb-5 animate-slideIn">
      <div className="flex flex-shrink-0 justify-center items-center border-gray-200 bg-gray-100 border rounded-full w-8 h-8">
        <Bot className="w-5 h-5 text-gray-600" />
      </div>

      <div className="relative before:top-[12px] before:left-[-8px] before:absolute border-gray-200 before:border-8 before:border-gray-100 bg-gray-100 px-4 py-2 border before:border-transparent before:border-t-8 before:border-r-[12px] before:border-l-0 rounded-2xl">
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <span>Attached app:</span>
          <AppChatBadge id={app.id} />
        </div>
      </div>
    </div>
  );
});
