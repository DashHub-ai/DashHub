import clsx from 'clsx';
import { type PropsWithChildren, useEffect, useRef } from 'react';

export function AnimatedGradientTitle({ children }: PropsWithChildren) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && ref.current) {
          ref.current.classList.add('animate-gradientHighlight');
        }
      },
      { threshold: 0.1 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <span className="inline-block relative">
      {children}
      <span
        ref={ref}
        className={clsx(
          '-bottom-2 left-0 absolute opacity-0 rounded h-[3px]',
          'bg-gradient-to-r from-[#e1727d] to-[#f2b535]',
        )}
        style={{
          transformOrigin: 'left',
          width: '0',
          maxWidth: 'max(64px, 30%)', // Keep the highlight shorter than the text
        }}
      />
    </span>
  );
}
