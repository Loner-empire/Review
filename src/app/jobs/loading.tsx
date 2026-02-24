// Global loading fallback shown while server components stream in
export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10" aria-hidden="true">
      <div className="skeleton h-8 w-56 mb-6 rounded" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="card space-y-3">
            <div className="skeleton h-5 w-3/4" />
            <div className="skeleton h-4 w-1/3" />
            <div className="skeleton h-14 w-full" />
            <div className="skeleton h-4 w-1/4 mt-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
