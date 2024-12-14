import clsx from 'clsx';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { type PropsWithChildren, useEffect, useRef, useState } from 'react';

import { useI18n } from '~/i18n';

export function CardDescription({ children }: PropsWithChildren) {
  const t = useI18n().pack;
  const ref = useRef<HTMLParagraphElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    if (ref.current) {
      const lineHeight = Number.parseInt(getComputedStyle(ref.current).lineHeight, 10);
      const height = ref.current.scrollHeight;

      setHasOverflow(height > lineHeight * 2);
    }
  }, [children]);

  return (
    <div>
      <p
        ref={ref}
        className={clsx(
          'flex-1 mb-4 text-muted-foreground text-sm',
          !isExpanded && 'line-clamp-2',
        )}
      >
        {children}
      </p>

      {hasOverflow && (
        <button
          type="button"
          onClick={() => setIsExpanded(prev => !prev)}
          className="flex items-center gap-1 hover:bg-gray-100 -mt-2 mb-2 -ml-2 px-2 py-0.5 rounded text-gray-900 text-xs"
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
      )}
    </div>
  );
}
