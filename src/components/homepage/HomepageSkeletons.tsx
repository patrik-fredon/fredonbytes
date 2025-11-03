export function ProjectsSectionSkeleton() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse space-y-8">
          {/* Section Header */}
          <div className="text-center space-y-4">
            <div className="h-12 bg-slate-700/50 rounded w-1/3 mx-auto"></div>
            <div className="h-6 bg-slate-700/30 rounded w-2/3 mx-auto"></div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <div className="h-48 bg-slate-700/50 rounded-lg"></div>
                <div className="h-6 bg-slate-700/40 rounded w-3/4"></div>
                <div className="h-4 bg-slate-700/30 rounded w-full"></div>
                <div className="h-4 bg-slate-700/30 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function AboutSectionSkeleton() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse space-y-16">
          {/* Section Header */}
          <div className="text-center space-y-4">
            <div className="h-12 bg-slate-700/50 rounded w-1/3 mx-auto"></div>
            <div className="h-6 bg-slate-700/30 rounded w-2/3 mx-auto"></div>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-slate-800/50 rounded-2xl p-8 space-y-4"
              >
                <div className="h-8 bg-slate-700/50 rounded w-1/2"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-700/30 rounded"></div>
                  <div className="h-4 bg-slate-700/30 rounded"></div>
                  <div className="h-4 bg-slate-700/30 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Core Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-slate-800/50 rounded-2xl p-6 space-y-4"
              >
                <div className="w-16 h-16 bg-slate-700/50 rounded-full mx-auto"></div>
                <div className="h-6 bg-slate-700/40 rounded w-3/4 mx-auto"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-slate-700/30 rounded"></div>
                  <div className="h-3 bg-slate-700/30 rounded"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Team */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-slate-800/50 rounded-2xl p-6 space-y-4"
              >
                <div className="w-24 h-24 bg-slate-700/50 rounded-full mx-auto"></div>
                <div className="h-5 bg-slate-700/40 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-slate-700/30 rounded w-1/2 mx-auto"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-slate-700/30 rounded"></div>
                  <div className="h-3 bg-slate-700/30 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ServicesSectionSkeleton() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-4">
            <div className="h-12 bg-slate-700/50 rounded w-1/3 mx-auto"></div>
            <div className="h-6 bg-slate-700/30 rounded w-2/3 mx-auto"></div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="bg-slate-800/50 rounded-2xl p-8 space-y-6"
              >
                <div className="w-16 h-16 bg-slate-700/50 rounded-full"></div>
                <div className="h-7 bg-slate-700/40 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-700/30 rounded"></div>
                  <div className="h-4 bg-slate-700/30 rounded"></div>
                  <div className="h-4 bg-slate-700/30 rounded w-5/6"></div>
                </div>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-slate-700/40 rounded-full"></div>
                      <div className="h-3 bg-slate-700/30 rounded flex-1"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center space-y-2">
                <div className="h-12 bg-slate-700/50 rounded w-2/3 mx-auto"></div>
                <div className="h-4 bg-slate-700/30 rounded w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function PricingSectionSkeleton() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse space-y-8">
          {/* Section Header */}
          <div className="text-center space-y-4">
            <div className="h-12 bg-slate-700/50 rounded w-1/3 mx-auto"></div>
            <div className="h-6 bg-slate-700/30 rounded w-2/3 mx-auto"></div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-6 p-8 bg-slate-800/50 rounded-lg">
                <div className="h-8 bg-slate-700/50 rounded w-1/2"></div>
                <div className="h-12 bg-slate-700/40 rounded w-3/4"></div>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <div key={j} className="h-4 bg-slate-700/30 rounded"></div>
                  ))}
                </div>
                <div className="h-12 bg-slate-700/50 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ContactSectionSkeleton() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse space-y-8">
          {/* Section Header */}
          <div className="text-center space-y-4">
            <div className="h-12 bg-slate-700/50 rounded w-1/3 mx-auto"></div>
            <div className="h-6 bg-slate-700/30 rounded w-2/3 mx-auto"></div>
          </div>

          {/* Contact Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-slate-700/50 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-slate-700/40 rounded w-1/3"></div>
                    <div className="h-4 bg-slate-700/30 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="bg-slate-800/50 rounded-2xl p-8 space-y-6">
              <div className="h-2 bg-slate-700/50 rounded"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-12 bg-slate-700/40 rounded"></div>
                ))}
              </div>
              <div className="h-12 bg-slate-700/50 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
