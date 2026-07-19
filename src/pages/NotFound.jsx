import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-3 px-6 text-center">
      <p className="font-display text-2xl text-indigo-500">Page not found</p>
      <p className="text-sm text-ink-500/70">
        This page doesn&apos;t exist. Head back to the home screen.
      </p>
      <Link
        to="/"
        className="mt-2 rounded-xl bg-maroon-500 px-4 py-2 font-utility text-sm font-semibold text-parchment-50"
      >
        Go home
      </Link>
    </div>
  );
}
