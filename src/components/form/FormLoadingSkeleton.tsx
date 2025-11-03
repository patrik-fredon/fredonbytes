/**
 * Loading skeleton component for the form
 * Displayed while FormClient is being loaded via dynamic import
 */
export default function FormLoadingSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">


      {/* Form container skeleton */}
      <div className="relative z-10 w-full max-w-2xl bg-white/95 dark:bg-slate-800/95 rounded-xl shadow-2xl p-6 sm:p-8 md:p-10 border border-slate-200/50 dark:border-slate-700/50">
        <div className="animate-pulse space-y-6">
          {/* Logo skeleton */}
          <div className="flex justify-center mb-8">
            <div className="h-16 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg" />
          </div>

          {/* Title skeleton */}
          <div className="space-y-3">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mx-auto" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mx-auto" />
          </div>

          {/* Content skeleton */}
          <div className="space-y-4 mt-8">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/6" />
          </div>

          {/* Button skeleton */}
          <div className="flex justify-center mt-8">
            <div className="h-12 w-32 bg-slate-200 dark:bg-slate-700 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
