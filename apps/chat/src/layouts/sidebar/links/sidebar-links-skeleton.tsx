import { Skeleton } from '~/ui/components/skeleton';

type SidebarLinksSkeletonProps = {
  count?: number;
};

export function SidebarLinksSkeleton({ count = 5 }: SidebarLinksSkeletonProps) {
  return (
    <ul>
      {Array.from({ length: count }).map((_, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <li key={index}>
          <div className="flex flex-row items-center gap-2 p-2 rounded-md w-full text-sm">
            <Skeleton className="w-5 h-5" variant="dark" />
            <Skeleton className="flex-1 h-4" variant="dark" />
          </div>
        </li>
      ))}
    </ul>
  );
}
