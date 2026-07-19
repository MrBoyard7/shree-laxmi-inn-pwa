import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SECTIONS = [
  { to: '/admin', label: 'Temples', end: true },
  { to: '/admin/routes', label: 'Routes' },
  { to: '/admin/guesthouse', label: 'Guesthouse' },
  { to: '/admin/contacts', label: 'Contacts' },
];

export default function AdminLayout() {
  const { signOut, user, isDemoAuth } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-dvh bg-parchment-100">
      <header className="bg-indigo-500 px-5 py-4 text-parchment-50 safe-top">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-lg">Admin Panel</p>
            <p className="text-xs text-parchment-100/70">
              Signed in as {user?.email}
              {isDemoAuth && ' (demo mode)'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-lg bg-white/10 px-3 py-1.5 font-utility text-xs font-semibold hover:bg-white/20"
          >
            Sign out
          </button>
        </div>
        <nav aria-label="Admin sections" className="mt-4 flex gap-2 overflow-x-auto">
          {SECTIONS.map((section) => (
            <NavLink
              key={section.to}
              to={section.to}
              end={section.end}
              className={({ isActive }) =>
                `shrink-0 rounded-full px-3 py-1.5 font-utility text-xs font-semibold transition-colors ${
                  isActive ? 'bg-marigold-500 text-indigo-700' : 'bg-white/10 hover:bg-white/20'
                }`
              }
            >
              {section.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-2xl px-5 py-6">
        <Outlet />
      </main>
    </div>
  );
}
