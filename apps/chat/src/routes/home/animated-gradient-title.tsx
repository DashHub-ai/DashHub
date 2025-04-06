import clsx from 'clsx';
import { useEffect, useRef } from 'react';

type AnimatedGradientTitleProps = {
  text: string;
};

export function AnimatedGradientTitle({ text }: AnimatedGradientTitleProps) {
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
      {text}
      <span
        ref={ref}
        className={clsx(
          '-bottom-2 left-0 absolute opacity-0 rounded h-[3px]',
          'bg-gradient-to-r from-[#e1727d] to-[#f2b535]',
        )}
        style={{
          transformOrigin: 'left',
          width: '0',
          maxWidth: '30%', // Keep the highlight shorter than the text
        }}
      />
    </span>
  );
}
