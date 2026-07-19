import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { CategoryChip } from '../common/Misc';
import { ClockIcon } from '../common/icons';
import { formatTime12h } from '../../utils/time';

/**
 * The image slot uses a temple-arch silhouette instead of a stock photo
 * placeholder: guesthouses rarely have professional temple photography
 * on day one, and an arch reads as "this is a temple" even before any
 * real photo is uploaded from the Admin Panel.
 */
function ArchPlaceholder({ photo = undefined, name }) {
  if (photo) {
    return <img src={photo} alt={name} className="h-full w-full object-cover" loading="lazy" />;
  }
  return (
    <div className="temple-arch flex h-full w-full items-end justify-center bg-gradient-to-b from-marigold-400 to-marigold-600">
      <svg viewBox="0 0 100 70" className="h-3/4 w-1/2 text-indigo-500/90" aria-hidden="true">
        <path d="M20 70V38a30 30 0 0 1 60 0v32" fill="none" stroke="currentColor" strokeWidth="7" />
      </svg>
    </div>
  );
}

ArchPlaceholder.propTypes = {
  photo: PropTypes.string,
  name: PropTypes.string.isRequired,
};

export default function TempleCard({ temple }) {
  const nextAartiTime = temple.aarti?.[0]?.time;

  return (
    <Link
      to={`/darshan-guide/${temple.id}`}
      className="flex gap-3 rounded-2xl bg-white/70 p-2 shadow-sm ring-1 ring-indigo-500/5 transition-shadow hover:shadow-diya"
    >
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl">
        <ArchPlaceholder photo={temple.photos?.[0]} name={temple.name} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 py-1">
        <CategoryChip label={temple.category} />
        <h3 className="truncate font-display text-base text-ink-700">{temple.name}</h3>
        <p className="line-clamp-1 text-xs text-ink-500/70">{temple.shortDescription}</p>
        {nextAartiTime && (
          <p className="tabular-time flex items-center gap-1 text-xs font-semibold text-maroon-500">
            <ClockIcon /> Aarti {formatTime12h(nextAartiTime)}
          </p>
        )}
      </div>
    </Link>
  );
}

TempleCard.propTypes = {
  temple: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string,
    shortDescription: PropTypes.string,
    photos: PropTypes.arrayOf(PropTypes.string),
    aarti: PropTypes.arrayOf(PropTypes.shape({ time: PropTypes.string })),
  }).isRequired,
};
