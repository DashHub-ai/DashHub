import type { PropsWithChildren } from 'react';

import clsx from 'clsx';
import { GhostIcon } from 'lucide-react';

type Props = PropsWithChildren & {
  spaced?: boolean;
  className?: string;
};

export function GhostPlaceholder({ children, className, spaced = true }: Props) {
  return (
    <div
      className={clsx(
        'flex flex-col justify-center items-center text-gray-300',
        spaced && 'p-12',
        className,
      )}
    >
      <div className="mb-4">
        <GhostIcon size={48} />
      </div>

      <div>{children}</div>
    </div>
  );
}
