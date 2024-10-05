import { type ReactNode, useState } from 'react';

import { type Nullable, timeout } from '@llm/commons';

export type AnimatedModalChildrenAttrs<Result> = {
  hiding: boolean;
  performCloseAnim: (result?: Nullable<Result>) => Promise<void>;
};

export type Props<Result> = {
  closeAnimDuration: number;
  children: (attrs: AnimatedModalChildrenAttrs<Result>) => ReactNode;
  onClose: (result?: Nullable<Result>) => void;
};

export function AnimatedModalWrapper<Result>({
  closeAnimDuration,
  children,
  onClose,
}: Props<Result>) {
  const [hiding, setHiding] = useState<boolean>();

  const performCloseAnim = async (result: Nullable<Result>) => {
    setHiding(true);
    await timeout(closeAnimDuration);
    setHiding(false);

    onClose(result);
  };

  return (
    <>
      {children({
        hiding: !!hiding,
        performCloseAnim,
      })}
    </>
  );
}
