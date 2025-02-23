import type { LucideIcon } from 'lucide-react';
import type { ComponentProps } from 'react';

type Props = ComponentProps<'button'> & {
  icon: LucideIcon;
  label: string;
};

export function ChatCodeToolbarButton({ icon: Icon, label, ...props }: Props) {
  return (
    <button
      type="button"
      className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-xs transition-colors"
      {...props}
    >
      <Icon className="w-3 h-3" />
      {label}
    </button>
  );
}
