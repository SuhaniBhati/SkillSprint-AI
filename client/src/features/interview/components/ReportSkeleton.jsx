/**
 * Skeleton resembling the report viewer's sidebar, hero, score circle,
 * question cards, and timeline - shown while useReport is loading. Mirrors
 * ReportViewer's grid so real content doesn't shift the layout on load.
 */
export default function ReportSkeleton() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 py-10 sm:px-6 lg:px-8">
      <div className="xl:grid xl:grid-cols-[260px_minmax(0,1fr)] xl:items-start xl:gap-10">
        <div className="hidden xl:block">
          <div className="space-y-2 rounded-2xl border border-[#ECE5EA] bg-white p-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-8 rounded-xl bg-[#ECE5EA]" />
            ))}
          </div>
        </div>

        <div className="min-w-0 space-y-10">
          <div className="rounded-3xl border border-[#ECE5EA] bg-white p-8">
            <div className="h-6 w-2/3 rounded-full bg-[#ECE5EA]" />
            <div className="mt-3 h-3 w-1/3 rounded-full bg-[#ECE5EA]" />
          </div>

          <div className="flex flex-col items-center rounded-3xl border border-[#ECE5EA] bg-white p-10">
            <div className="h-56 w-56 rounded-full bg-[#ECE5EA]" />
            <div className="mt-6 h-3 w-64 rounded-full bg-[#ECE5EA]" />
          </div>

          {[0, 1].map((section) => (
            <div key={section} className="space-y-3">
              <div className="h-5 w-56 rounded-full bg-[#ECE5EA]" />
              {[0, 1, 2].map((card) => (
                <div key={card} className="h-16 rounded-2xl border border-[#ECE5EA] bg-white" />
              ))}
            </div>
          ))}

          <div className="space-y-4">
            <div className="h-5 w-56 rounded-full bg-[#ECE5EA]" />
            {[0, 1, 2].map((row) => (
              <div key={row} className="h-24 rounded-2xl border border-[#ECE5EA] bg-white pl-8" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}