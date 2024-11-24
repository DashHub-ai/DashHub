import clsx from 'clsx';

export function ChatMessageVariants() {
  return (
    <div className="right-4 bottom-[-24px] absolute flex gap-0 border-gray-200 border border-t-0 rounded-b-lg rounded-t-none overflow-hidden">
      {[1, 2, 3].map((variant, index) => (
        <button
          key={variant}
          type="button"
          className={clsx(
            'flex justify-center items-center border-r last:border-r-0 w-6 h-[22px] text-xs transition-colors',
            {
              'bg-gray-200 text-gray-700 font-medium': !index,
              'bg-white hover:bg-gray-50 text-gray-500': index > 0,
            },
          )}
        >
          {variant}
        </button>
      ))}
    </div>
  );
}
