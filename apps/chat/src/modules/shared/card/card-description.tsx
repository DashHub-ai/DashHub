import clsx from 'clsx';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { type PropsWithChildren, useEffect, useRef, useState } from 'react';

import { useI18n } from '~/i18n';

type Props = PropsWithChildren & {
  className?: string;
};

export function CardDescription({ children, className }: Props) {
  const t = useI18n().pack;
  const ref = useRef<HTMLParagraphElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [isExpanded, setIsExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState<boolean | null>(null);

  const checkHasOverflow = () => {
    if (!ref.current || !wrapperRef.current) {
      return;
    }

    setHasOverflow(ref.current.clientHeight > wrapperRef.current.clientHeight);
  };

  useEffect(() => {
    checkHasOverflow();
  }, []);

  return (
    <div className={clsx('flex flex-col flex-1 mb-2 last:mb-0', className)}>
      <div
        ref={wrapperRef}
        className={clsx(
          'overflow-hidden',
          !isExpanded && 'max-h-[2.6rem]',
        )}
      >
        <p
          ref={ref}
          className={clsx(
            'flex-1 text-muted-foreground text-sm',
            hasOverflow && !isExpanded && 'line-clamp-2',
          )}
        >
          {children}
        </p>
      </div>

      {hasOverflow && (
        <div className="flex flex-row justify-center mt-2 w-full">
          <button
            type="button"
            onClick={() => setIsExpanded(prev => !prev)}
            className="flex flex-row gap-1 hover:bg-gray-100 px-2 py-0.5 rounded text-gray-900 text-xs"
          >
            {isExpanded
              ? (
                  <>
                    {t.chat.actions.expand.less}
                    <ChevronUpIcon size={14} />
                  </>
                )
              : (
                  <>
                    {t.chat.actions.expand.more}
                    <ChevronDownIcon size={14} />
                  </>
                )}
          </button>
        </div>
      )}
    </div>
  );
}
