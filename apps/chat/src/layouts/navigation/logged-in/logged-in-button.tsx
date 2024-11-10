import { UkIcon } from '@llm/ui';

export function LoggedInButton() {
  return (
    <button
      type="button"
      className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground px-4 py-2 relative h-8 w-8 rounded-full"
      aria-haspopup="true"
    >
      <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full items-center justify-center uk-background-secondary">
        <UkIcon icon="user" />
      </span>
    </button>
  );
}
