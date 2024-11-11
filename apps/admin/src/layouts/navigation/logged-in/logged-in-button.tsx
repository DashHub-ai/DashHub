import { UserIcon } from 'lucide-react';

export function LoggedInButton() {
  return (
    <button
      type="button"
      className="inline-flex relative justify-center items-center hover:bg-accent disabled:opacity-50 px-4 py-2 rounded-full focus-visible:ring-1 focus-visible:ring-ring w-8 h-8 font-medium text-sm hover:text-accent-foreground whitespace-nowrap transition-colors focus-visible:outline-none disabled:pointer-events-none"
      aria-haspopup="true"
    >
      <span className="relative flex justify-center items-center rounded-full w-8 h-8 overflow-hidden shrink-0 uk-background-secondary">
        <UserIcon size={16} />
      </span>
    </button>
  );
}
