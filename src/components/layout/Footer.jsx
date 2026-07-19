import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mx-auto max-w-md px-4 pb-28 pt-6 text-center text-xs text-ink-500/60">
      <p>Shree Laxmi Inn &middot; Ayodhya, Uttar Pradesh</p>
      <p className="mt-1">Timings shown are indicative. Please confirm at the reception desk.</p>
      <Link to="/admin/login" className="mt-3 inline-block underline-offset-2 hover:underline">
        Staff admin login
      </Link>
    </footer>
  );
}
