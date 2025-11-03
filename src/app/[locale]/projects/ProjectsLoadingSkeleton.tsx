export default function ProjectsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-slate-50 dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg animate-pulse"
        >
          {/* Image skeleton */}
          <div className="h-48 bg-slate-200 dark:bg-slate-700" />

          {/* Content skeleton */}
          <div className="p-6 space-y-4">
            {/* Title */}
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />

            {/* Description */}
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
            </div>

            {/* Technologies */}
            <div className="flex flex-wrap gap-2">
              <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
