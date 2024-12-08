import type { ContentHydrator } from './hydrate-result';

import { MessageContentActionButton } from '../messages/buttons';

type ChatAction = {
  label: string;
  action: string;
};

export type HydratedChatActionsAttrs = {
  onAction: (action: string) => void;
  darkMode?: boolean;
  disabled?: boolean;
};

export function hydrateWithChatActions(
  {
    onAction,
    darkMode,
    disabled,
  }: HydratedChatActionsAttrs,
): ContentHydrator {
  return (content) => {
    const actions: ChatAction[] = [];

    // Prevent CLS with flashing unclosed tags for both bracket types
    const unclosedSquareTagIndex = content.lastIndexOf('[action:');
    const unclosedParenTagIndex = content.lastIndexOf('(action:');
    const lastUnclosedIndex = Math.max(unclosedSquareTagIndex, unclosedParenTagIndex);

    if (lastUnclosedIndex !== -1) {
      const slice = content.slice(lastUnclosedIndex);
      const matchingChar = content[lastUnclosedIndex] === '[' ? ']' : ')';
      if (!slice.includes(matchingChar)) {
        content = content.slice(0, lastUnclosedIndex);
      }
    }

    const cleanContent = content.replace(
      /[[(]action:([^|\])]+)\|([^|\])]+)[\])]/g,
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
                disabled={disabled}
                darkMode={darkMode}
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
