import type { PropsWithChildren } from 'react';

import clsx from 'clsx';

type Props = PropsWithChildren & {
  truncated?: boolean;
};

export function PageFormSection({ children, truncated = true }: Props) {
  return (
    <section
      className={clsx(
        'flex flex-col gap-10 mx-auto mt-5',
        truncated ? 'max-w-4xl' : 'max-w-6xl',
      )}
    >
      {children}
    </section>
  );
}
