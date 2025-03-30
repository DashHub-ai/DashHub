import { Skeleton } from '../skeleton';

export function SelectableBadgesSkeleton() {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          className="rounded-full w-24 h-8"
        />
      ))}
    </div>
  );
}
