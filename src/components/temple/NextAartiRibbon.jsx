import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getNextAarti, formatTime12h, formatCountdown } from '../../utils/time';
import { FlameIcon } from '../common/icons';

/**
 * The one element this app is built to be remembered by: a lit-diya
 * ribbon that always tells a guest, at a glance, which aarti is coming
 * up next and where, without them opening the full temple list.
 */
export default function NextAartiRibbon({ temples }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  const next = getNextAarti(temples, now);
  if (!next) return null;

  return (
    <Link
      to={`/darshan-guide/${next.templeId}`}
      className="flex items-center gap-3 rounded-2xl bg-indigo-500 px-4 py-3 text-parchment-50 shadow-diya"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-marigold-500 text-indigo-700">
        <FlameIcon />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-utility text-[11px] uppercase tracking-widest text-marigold-400">
          {next.isTomorrow ? 'Next aarti (tomorrow)' : 'Next aarti in'}
        </span>
        <span className="block truncate font-display text-sm">
          {next.aartiName} &middot; {next.templeName}
        </span>
      </span>
      <span className="tabular-time shrink-0 rounded-xl bg-white/10 px-2.5 py-1.5 text-right text-sm font-semibold">
        <span className="block leading-none">{formatCountdown(next.minutesUntil)}</span>
        <span className="block text-[10px] font-normal text-parchment-100/70">
          {formatTime12h(next.time)}
        </span>
      </span>
    </Link>
  );
}

NextAartiRibbon.propTypes = {
  temples: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      aarti: PropTypes.array,
    }),
  ).isRequired,
};
