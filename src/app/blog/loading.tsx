export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10" aria-hidden="true">
      <div className="flex gap-2 mb-8">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="skeleton h-7 w-20 rounded-full" />
        ))}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3].map((n) => (
          <div key={n} className="card space-y-3">
            <div className="skeleton -mx-5 -mt-5 h-40 rounded-t-lg" />
            <div className="skeleton h-4 w-1/3" />
            <div className="skeleton h-5 w-3/4" />
            <div className="skeleton h-14 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
