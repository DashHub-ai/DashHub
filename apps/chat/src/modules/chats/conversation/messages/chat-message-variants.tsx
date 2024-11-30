import { controlled } from '@under-control/forms';
import clsx from 'clsx';
import { makeBy } from 'fp-ts/lib/Array';

type Props = {
  total: number;
};

export const ChatMessageVariants = controlled<number, Props>(({ total, control: { value, setValue } }) => {
  return (
    <div className="right-4 bottom-[-24px] absolute flex gap-0 border-gray-200 border border-t-0 rounded-b-lg rounded-t-none overflow-hidden">
      {makeBy(total, variant => (
        <button
          key={variant}
          type="button"
          className={clsx(
            'flex justify-center items-center border-r last:border-r-0 w-6 h-[22px] text-xs transition-colors',
            {
              'bg-gray-200 text-gray-700 font-medium': variant === value,
              'bg-white hover:bg-gray-50 text-gray-500': variant !== value,
            },
          )}
          onClick={() => setValue({ value: variant })}
        >
          {variant + 1}
        </button>
      ))}
    </div>
  );
});
