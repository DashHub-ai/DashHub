import type { PropsWithChildren } from 'react';

import { GhostIcon } from 'lucide-react';

export function GhostPlaceholder({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col justify-center items-center p-12 text-gray-300">
      <div className="mb-4">
        <GhostIcon size={48} />
      </div>

      <div>{children}</div>
    </div>
  );
}
