import { SendHorizontalIcon } from 'lucide-react';

import type { ContentHydrator } from './hydrate-result';

import { MessageContentActionButton } from '../messages/buttons';

type ChatAction = {
  label: string;
  action: string;
};

export function hydrateWithChatActions(
  onAction: (action: string) => void,
  darkMode?: boolean,
): ContentHydrator {
  return (content) => {
    if (Array.isArray(content)) {
      return { content, prependToolbars: [], appendToolbars: [] };
    }

    const actions: ChatAction[] = [];
    const cleanContent = content.replace(
      /\[action:([^|\]]+)\|([^|\]]+)\]/g,
      (_, label, action) => {
        actions.push({ label, action });
        return '';
      },
    );

    const actionsToolbar = actions.length
      ? (
          <div key="chat-actions" className="flex flex-wrap gap-2 mt-3 mb-4">
            {actions.map(({ label, action }) => (
              <MessageContentActionButton
                key={`${label}-${action}`}
                darkMode={darkMode}
                icon={<SendHorizontalIcon size={16} />}
                onClick={() => onAction(action)}
              >
                {label}
              </MessageContentActionButton>
            ))}
          </div>
        )
      : null;

    return {
      content: cleanContent.trim(),
      prependToolbars: [],
      appendToolbars: actionsToolbar ? [actionsToolbar] : [],
    };
  };
}
