import PropTypes from 'prop-types';

export function LoadingSpinner({ label = 'Loading…' }) {
  return (
    <div role="status" className="flex flex-col items-center gap-3 py-16 text-indigo-400">
      <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-indigo-200 border-t-maroon-500" />
      <span className="font-utility text-sm">{label}</span>
    </div>
  );
}

LoadingSpinner.propTypes = { label: PropTypes.string };

export function EmptyState({ title, description = undefined }) {
  return (
    <div className="rounded-2xl border border-dashed border-indigo-200 bg-white/50 p-6 text-center">
      <p className="font-display text-base text-indigo-500">{title}</p>
      {description && <p className="mt-1 text-sm text-ink-500/70">{description}</p>}
    </div>
  );
}

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
};

export function SectionTitle({ eyebrow = undefined, title }) {
  return (
    <div className="mb-3">
      {eyebrow && (
        <p className="font-utility text-xs font-semibold uppercase tracking-widest text-maroon-500">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-xl text-indigo-500">{title}</h2>
    </div>
  );
}

SectionTitle.propTypes = {
  eyebrow: PropTypes.string,
  title: PropTypes.string.isRequired,
};

export function CategoryChip({ label }) {
  return (
    <span className="inline-flex items-center rounded-full bg-indigo-500/8 px-2.5 py-0.5 font-utility text-[11px] font-semibold uppercase tracking-wide text-indigo-500">
      {label}
    </span>
  );
}

CategoryChip.propTypes = { label: PropTypes.string.isRequired };
