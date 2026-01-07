import { Skeleton } from "@/components/ui/skeleton";

export function DashboardLayoutSkeleton() {
  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar Skeleton */}
      <div className="hidden border-r bg-muted/40 md:block md:w-[260px]">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="flex-1 px-2 py-2">
            <div className="space-y-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex flex-col w-full">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Skeleton className="h-8 w-8 rounded-full md:hidden" />
          <div className="w-full flex-1">
            <Skeleton className="h-9 w-full max-w-md" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="flex items-center">
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
          <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
            <Skeleton className="h-[400px] xl:col-span-2" />
            <Skeleton className="h-[400px]" />
          </div>
        </main>
      </div>
    </div>
  );
}
