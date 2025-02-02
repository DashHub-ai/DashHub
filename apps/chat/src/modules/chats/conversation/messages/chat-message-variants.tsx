import { controlled } from '@under-control/forms';
import clsx from 'clsx';
import { makeBy } from 'fp-ts/lib/Array';
import { Clock } from 'lucide-react';

type Props = {
  total: number;
  timestamps: Date[];
};

export const ChatMessageVariants = controlled<number, Props>(({ total, timestamps, control: { value, setValue } }) => {
  return (
    <div className="flex gap-1 ml-auto">
      {makeBy(total, variant => (
        <button
          key={variant}
          type="button"
          className={clsx(
            'group flex items-center gap-1.5 px-2 py-1.5 rounded text-xs transition-all',
            'hover:scale-105 active:scale-95',
            {
              'bg-gray-200 text-gray-800 font-medium': variant === value,
              'bg-gray-100/50 text-gray-600 hover:bg-gray-200/70': variant !== value,
            },
          )}
          onClick={() => setValue({ value: variant })}
        >
          <Clock className="opacity-50 group-hover:opacity-100 w-3 h-3" />
          <span>{new Date(timestamps[variant]).toLocaleTimeString()}</span>
        </button>
      ))}
    </div>
  );
});
