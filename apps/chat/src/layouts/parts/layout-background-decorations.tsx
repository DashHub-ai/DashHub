import clsx from 'clsx';
import { memo } from 'react';

type BackgroundDecorationsProps = {
  className?: string;
  sidebarWidth?: number;
};

export const LayoutBackgroundDecorations = memo((
  {
    className = '',
    sidebarWidth = 0,
  }: BackgroundDecorationsProps,
) => {
  return (
    <div className={clsx('z-0 fixed inset-0 overflow-hidden pointer-events-none', className)}>
      {/* Adding an inner container that respects padding */}
      <div
        className="absolute inset-0"
        style={{
          marginLeft: `${sidebarWidth}px`,
          width: `calc(100% - ${sidebarWidth}px)`,
        }}
      >
        {/* Dot pattern in top right */}
        <div className="top-10 right-10 absolute opacity-10 w-80 h-80">
          <div className="absolute gap-4 grid grid-cols-8 w-full h-full">
            {Array.from({ length: 64 }).fill(0).map((_, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <div key={i} className="bg-blue-500 rounded-full w-2 h-2"></div>
            ))}
          </div>
        </div>

        {/* Alternative geometric decoration in bottom left with higher opacity */}
        <div className="bottom-0 left-0 absolute opacity-[4%] w-96 h-96">
          <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            {/* Concentric triangles */}
            <polygon points="50,10 90,80 10,80" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <polygon points="50,20 80,75 20,75" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <polygon points="50,30 70,70 30,70" fill="none" stroke="currentColor" strokeWidth="0.5" />
            {/* Center point */}
            <circle cx="50" cy="60" r="2" fill="currentColor" opacity="0.7" />
          </svg>
        </div>

        {/* Geometric shapes in right center */}
        <div className="top-1/3 right-20 absolute opacity-10">
          <div className="border-2 border-gray-500 w-20 h-20 rotate-45 transform"></div>
          <div className="border-2 border-gray-500 w-20 h-20 -translate-y-14 translate-x-14 transform"></div>
          <div className="border-2 border-gray-500 rounded-full w-20 h-20 -translate-y-10 translate-x-7 transform"></div>
        </div>

        {/* Grid lines in top left */}
        <div className="top-20 left-10 absolute opacity-5 w-64 h-64">
          <div className="grid grid-cols-4 grid-rows-4 border border-gray-400 w-full h-full">
            {Array.from({ length: 16 }).fill(0).map((_, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <div key={i} className="border border-gray-400"></div>
            ))}
          </div>
        </div>

        {/* Circle pattern in bottom right */}
        <div className="right-10 bottom-10 absolute opacity-10">
          <div className="border-2 border-gray-400 rounded-full w-40 h-40"></div>
          <div className="top-5 left-5 absolute border-2 border-gray-400 rounded-full w-30 h-30"></div>
          <div className="top-10 left-10 absolute border-2 border-gray-400 rounded-full w-20 h-20"></div>
        </div>

        {/* Angled lines in left corner */}
        <div className={clsx('top-40 left-20 absolute opacity-10')}>
          <svg width="150" height="150" viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,0 L150,150" stroke="currentColor" strokeWidth="1.5" />
            <path d="M30,0 L150,120" stroke="currentColor" strokeWidth="1.5" />
            <path d="M60,0 L150,90" stroke="currentColor" strokeWidth="1.5" />
            <path d="M90,0 L150,60" stroke="currentColor" strokeWidth="1.5" />
            <path d="M120,0 L150,30" stroke="currentColor" strokeWidth="1.5" />
            <path d="M0,30 L120,150" stroke="currentColor" strokeWidth="1.5" />
            <path d="M0,60 L90,150" stroke="currentColor" strokeWidth="1.5" />
            <path d="M0,90 L60,150" stroke="currentColor" strokeWidth="1.5" />
            <path d="M0,120 L30,150" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
    </div>
  );
});
