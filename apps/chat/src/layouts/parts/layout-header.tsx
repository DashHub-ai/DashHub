import type { PropsWithChildren } from 'react';

import { AnimatedGradientTitle } from '~/routes/home/animated-gradient-title';

export function LayoutHeader({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col space-y-3">
      {children && (
        <h1 className="font-bold text-3xl tracking-tight">
          <AnimatedGradientTitle>
            {children}
          </AnimatedGradientTitle>
        </h1>
      )}
    </div>
  );
}
