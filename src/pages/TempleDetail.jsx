import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import PageHeader from '../components/layout/PageHeader';
import { LoadingSpinner, CategoryChip } from '../components/common/Misc';
import QuickActionButton from '../components/common/QuickActionButton';
import { NavigateIcon, ClockIcon, FlameIcon } from '../components/common/icons';
import { googleMapsDirectionsLink } from '../utils/links';
import { formatTime12h } from '../utils/time';

export default function TempleDetail() {
  const { templeId } = useParams();
  const { temples, isLoading } = useData();

  if (isLoading) return <LoadingSpinner label="Loading temple details…" />;

  const temple = temples.find((t) => t.id === templeId);

  if (!temple) {
    return (
      <div className="px-5 py-10 text-center">
        <p className="font-display text-lg text-indigo-500">Temple not found</p>
        <Link to="/darshan-guide" className="mt-2 inline-block text-sm text-maroon-500 underline">
          Back to the Darshan Guide
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-28">
      <PageHeader title={temple.name} subtitle={temple.category} />

      <div className="temple-arch mx-5 mt-4 flex h-44 items-end justify-center overflow-hidden bg-gradient-to-b from-marigold-400 to-marigold-600">
        {temple.photos?.[0] ? (
          <img src={temple.photos[0]} alt={temple.name} className="h-full w-full object-cover" />
        ) : (
          <svg viewBox="0 0 100 70" className="h-3/4 w-1/2 text-indigo-500/90" aria-hidden="true">
            <path
              d="M20 70V38a30 30 0 0 1 60 0v32"
              fill="none"
              stroke="currentColor"
              strokeWidth="7"
            />
          </svg>
        )}
      </div>

      <div className="px-5 pt-4">
        <CategoryChip label={temple.category} />
        <p className="mt-3 text-sm leading-relaxed text-ink-700">{temple.shortDescription}</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-500/80">{temple.history}</p>

        <div className="mt-5">
          <QuickActionButton
            href={googleMapsDirectionsLink(temple.mapsQuery)}
            icon={<NavigateIcon />}
            label="Navigate with Google Maps"
            variant="primary"
            external
          />
        </div>

        <section className="mt-6 rounded-2xl bg-white/70 p-4 ring-1 ring-indigo-500/5">
          <h2 className="flex items-center gap-1.5 font-display text-base text-indigo-500">
            <ClockIcon /> Timings
          </h2>
          <p className="tabular-time mt-1 text-sm text-ink-700">
            {formatTime12h(temple.timings?.open)} – {formatTime12h(temple.timings?.close)}
          </p>
        </section>

        {temple.aarti?.length > 0 && (
          <section className="mt-4 rounded-2xl bg-white/70 p-4 ring-1 ring-indigo-500/5">
            <h2 className="flex items-center gap-1.5 font-display text-base text-indigo-500">
              <FlameIcon /> Aarti Timings
            </h2>
            <ul className="mt-2 divide-y divide-indigo-500/10">
              {temple.aarti.map((aarti) => (
                <li key={aarti.name} className="flex items-center justify-between py-2 text-sm">
                  <span className="text-ink-700">{aarti.name}</span>
                  <span className="tabular-time font-semibold text-maroon-500">
                    {formatTime12h(aarti.time)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="mt-4 text-xs text-ink-500/60">Address (approximate): {temple.address}</p>
      </div>
    </div>
  );
}
