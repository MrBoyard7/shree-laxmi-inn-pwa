import PropTypes from 'prop-types';

const VARIANTS = {
  primary: 'bg-maroon-500 text-parchment-50 hover:bg-maroon-600',
  gold: 'bg-gold-500 text-indigo-700 hover:bg-gold-600',
  outline: 'border-2 border-indigo-500 text-indigo-500 hover:bg-indigo-50',
  outlineLight: 'border-2 border-parchment-50/60 text-parchment-50 hover:bg-white/10',
};

/**
 * A large, thumb-friendly action button for the one-tap actions this
 * app exists to provide: Call, WhatsApp, Navigate, Review.
 */
export default function QuickActionButton({
  href = undefined,
  icon,
  label,
  variant = 'primary',
  onClick = undefined,
  external = false,
}) {
  const classes = `flex flex-1 flex-col items-center justify-center gap-1.5 rounded-2xl px-3 py-3.5 text-center font-utility text-sm font-semibold shadow-diya transition-colors ${VARIANTS[variant]}`;

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={classes}>
        <span aria-hidden="true">{icon}</span>
        <span>{label}</span>
      </button>
    );
  }

  return (
    <a
      href={href}
      className={classes}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
    >
      <span aria-hidden="true">{icon}</span>
      <span>{label}</span>
    </a>
  );
}

QuickActionButton.propTypes = {
  href: PropTypes.string,
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(Object.keys(VARIANTS)),
  onClick: PropTypes.func,
  external: PropTypes.bool,
};
