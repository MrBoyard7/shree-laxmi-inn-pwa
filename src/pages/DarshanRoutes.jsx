import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import PageHeader from '../components/layout/PageHeader';
import { LoadingSpinner, EmptyState } from '../components/common/Misc';

export default function DarshanRoutes() {
  const { routes, temples, isLoading } = useData();
  const [activeRouteId, setActiveRouteId] = useState(null);

  if (isLoading) return <LoadingSpinner label="Loading routes…" />;
  if (routes.length === 0) {
    return (
      <div className="px-5 py-10">
        <PageHeader title="Darshan Routes" />
        <EmptyState title="No routes yet" description="Add routes from the Admin Panel." />
      </div>
    );
  }

  const activeRoute = routes.find((r) => r.id === activeRouteId) || routes[0];
  const stops = activeRoute.templeIds
    .map((templeId) => temples.find((t) => t.id === templeId))
    .filter(Boolean);

  return (
    <div className="pb-28">
      <PageHeader title="Darshan Routes" subtitle="Pick a route that fits your time" />

      <div className="flex gap-2 px-5 py-4">
        {routes.map((route) => (
          <button
            key={route.id}
            type="button"
            onClick={() => setActiveRouteId(route.id)}
            className={`flex-1 rounded-xl py-2.5 text-center font-utility text-sm font-semibold transition-colors ${
              activeRoute.id === route.id
                ? 'bg-maroon-500 text-parchment-50'
                : 'bg-white text-indigo-500 ring-1 ring-indigo-500/10'
            }`}
          >
            {route.label}
          </button>
        ))}
      </div>

      <div className="px-5">
        <h2 className="font-display text-lg text-indigo-500">{activeRoute.title}</h2>
        <p className="mt-1 text-sm text-ink-500/70">{activeRoute.description}</p>
        <p className="mt-1 font-utility text-xs font-semibold uppercase tracking-wide text-maroon-500">
          {activeRoute.suggestedTransport}
        </p>

        <ol className="mt-5 space-y-0">
          {stops.map((temple, index) => (
            <li key={temple.id} className="relative flex gap-3 pb-6 last:pb-0">
              {index < stops.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute left-[15px] top-8 h-full w-0.5 bg-indigo-500/15"
                />
              )}
              <span className="tabular-time relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-marigold-500 text-sm font-bold text-indigo-700">
                {index + 1}
              </span>
              <Link
                to={`/darshan-guide/${temple.id}`}
                className="flex-1 rounded-xl bg-white/70 px-3 py-2.5 ring-1 ring-indigo-500/5"
              >
                <p className="font-display text-sm text-ink-700">{temple.name}</p>
                <p className="text-xs text-ink-500/70">{temple.category}</p>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
