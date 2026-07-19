import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const { signIn, isAuthenticated, isDemoAuth, demoCredentials } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    const redirectTo = location.state?.from?.pathname || '/admin';
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await signIn(email, password);
      navigate('/admin', { replace: true });
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-indigo-500 px-6">
      <div className="w-full max-w-sm rounded-2xl bg-parchment-50 p-6 shadow-diya">
        <h1 className="font-display text-xl text-indigo-500">Staff Admin Login</h1>
        <p className="mt-1 text-sm text-ink-500/70">Manage temples, routes and contacts.</p>

        {isDemoAuth && (
          <p className="mt-3 rounded-lg bg-marigold-50 p-2.5 text-xs text-marigold-700">
            Demo mode: use <strong>{demoCredentials.email}</strong> /{' '}
            <strong>{demoCredentials.password}</strong>. Connect Firebase to replace this with real
            accounts (see README.md).
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm text-ink-700">
            Email
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-lg border border-indigo-500/15 px-3 py-2 text-sm outline-none focus:border-maroon-500"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-ink-700">
            Password
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-lg border border-indigo-500/15 px-3 py-2 text-sm outline-none focus:border-maroon-500"
            />
          </label>

          {error && <p className="text-sm text-maroon-500">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 rounded-lg bg-maroon-500 py-2.5 font-utility text-sm font-semibold text-parchment-50 disabled:opacity-60"
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
