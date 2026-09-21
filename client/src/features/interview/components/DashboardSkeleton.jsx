/**
 * Skeleton grid shown while reports are loading. Avoids a bare spinner
 * so the layout doesn't jump once real cards arrive. Mirrors ReportCard's
 * current shape (top accent bar, content, bottom action row).
 */
export default function DashboardSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse overflow-hidden rounded-2xl border border-[#ECE5EA] bg-white"
        >
          <div className="h-1 bg-[#ECE5EA]" />
          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="h-4 w-3/5 rounded-full bg-[#ECE5EA]" />
              <div className="h-5 w-10 rounded-full bg-[#ECE5EA]" />
            </div>
            <div className="mt-3 h-3 w-1/3 rounded-full bg-[#ECE5EA]" />
            <div className="mt-5 space-y-2">
              <div className="h-2.5 w-24 rounded-full bg-[#ECE5EA]" />
              <div className="h-2.5 w-20 rounded-full bg-[#ECE5EA]" />
            </div>
            <div className="mt-4 flex items-center justify-end gap-1 border-t border-[#ECE5EA] pt-3">
              <div className="h-8 w-8 rounded-full bg-[#ECE5EA]" />
              <div className="h-8 w-8 rounded-full bg-[#ECE5EA]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}