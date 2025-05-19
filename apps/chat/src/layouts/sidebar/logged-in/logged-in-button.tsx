import { Loader2, UserIcon } from 'lucide-react';

import { useSdkSubscribeMeOrThrow } from '@dashhub/sdk';

export function LoggedInButton() {
  const data = useSdkSubscribeMeOrThrow();

  return (
    <button
      type="button"
      className="inline-flex relative justify-center items-center disabled:opacity-50 rounded-full focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-dmsans text-sm whitespace-nowrap transition-colors hover:text-accent-foreground disabled:pointer-events-none"
      aria-haspopup="true"
    >
      <span className="relative flex justify-center items-center rounded-full w-10 h-10 overflow-hidden shrink-0 uk-background-secondary">
        {data.loading
          ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            )
          : data.me.avatar
            ? (
                <img
                  src={data.me.avatar.publicUrl}
                  alt="Profile"
                  className="border border-border w-full h-full object-contain"
                />
              )
            : (
                <UserIcon size={16} />
              )}
      </span>

      {!data.loading && data.me.name && (
        <span className="ml-2 text-gray-500">{data.me.name}</span>
      )}
    </button>
  );
}
