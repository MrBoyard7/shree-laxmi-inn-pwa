import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function PageHeader({ title, subtitle = undefined }) {
  const navigate = useNavigate();

  return (
    <header className="safe-top sticky top-0 z-20 bg-indigo-500 text-parchment-50 shadow-diya">
      <div className="mx-auto flex max-w-md items-center gap-3 px-4 py-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="-ml-1 rounded-full p-1.5 text-parchment-50/90 hover:bg-white/10"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
            <path
              d="M15 5 8 12l7 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div>
          <h1 className="font-display text-lg leading-tight">{title}</h1>
          {subtitle && <p className="text-xs text-parchment-100/80">{subtitle}</p>}
        </div>
      </div>
    </header>
  );
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
};
