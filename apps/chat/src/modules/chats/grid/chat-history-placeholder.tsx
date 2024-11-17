import { GhostIcon } from 'lucide-react';

import { useI18n } from '~/i18n';

export function ChatHistoryPlaceholder() {
  const t = useI18n().pack.chats.history;

  return (
    <div className="flex flex-col justify-center items-center p-12 text-gray-300">
      <div className="mb-4">
        <GhostIcon size={48} />
      </div>

      <div>{t.placeholder}</div>
    </div>
  );
}
