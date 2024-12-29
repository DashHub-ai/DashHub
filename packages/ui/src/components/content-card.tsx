import type { PropsWithChildren, ReactNode } from 'react';

type Props = PropsWithChildren & {
  title: string;
  toolbar?: ReactNode;
};

export function ContentCard({ title, toolbar, children }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-medium font-semibold text-lg">{title}</h2>
        {toolbar && (
          <div className="flex items-center gap-2">
            {toolbar}
          </div>
        )}
      </div>

      <div className="relative flex flex-col bg-white shadow-sm p-6 pb-2 border border-border/50 rounded-lg">
        {children}
      </div>
    </div>
  );
}
