import type { PropsWithChildren, RefObject } from 'react';

export type BalloonContentProps = PropsWithChildren & {
  contentRef: RefObject<HTMLDivElement | null>;
  targetRect: DOMRect;
};

export function BalloonContent({ contentRef, children, targetRect }: BalloonContentProps) {
  const gap = 8;

  return (
    <div
      className="z-50 fixed"
      style={{
        top: targetRect.top - gap,
        left: targetRect.left + (targetRect.width / 2),
      }}
    >
      <div className="relative animate-balloonIn" ref={contentRef}>
        <div className="bg-gray-900 shadow-lg px-2 py-1 rounded text-white text-xs whitespace-nowrap">
          {children}
        </div>
        <div
          className="bottom-[-8px] left-1/2 absolute w-0 h-0 -translate-x-1/2"
          style={{
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '8px solid rgb(17 24 39)',
          }}
        />
      </div>
    </div>
  );
}
