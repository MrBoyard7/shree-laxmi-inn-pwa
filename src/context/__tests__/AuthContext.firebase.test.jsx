import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';

vi.mock('../../firebase/config', () => ({
  auth: { name: 'mock-auth' },
  isFirebaseConfigured: true,
}));

const authStateCallback = vi.hoisted(() => ({ current: null }));

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn((auth, callback) => {
    authStateCallback.current = callback;
    return vi.fn(); // unsubscribe
  }),
  signInWithEmailAndPassword: vi.fn(async (auth, email) => ({
    user: { email, isDemo: false },
  })),
  signOut: vi.fn(async () => undefined),
}));

const { AuthProvider, useAuth } = await import('../AuthContext');
const { signInWithEmailAndPassword, signOut } = await import('firebase/auth');

function Probe() {
  const {
    isLoading,
    isAuthenticated,
    isDemoAuth,
    user,
    signIn,
    signOut: contextSignOut,
  } = useAuth();
  return (
    <div>
      <p>loading: {String(isLoading)}</p>
      <p>authenticated: {String(isAuthenticated)}</p>
      <p>demo: {String(isDemoAuth)}</p>
      <p>email: {user?.email || 'none'}</p>
      <button type="button" onClick={() => signIn('staff@realproject.com', 'secret')}>
        sign in
      </button>
      <button type="button" onClick={() => contextSignOut()}>
        sign out
      </button>
    </div>
  );
}

describe('AuthContext (Firebase configured)', () => {
  it('starts in a loading state until onAuthStateChanged reports back', () => {
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );
    expect(screen.getByText('loading: true')).toBeInTheDocument();
    expect(screen.getByText('demo: false')).toBeInTheDocument();
  });

  it('becomes authenticated once onAuthStateChanged reports a user', () => {
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );

    act(() => {
      authStateCallback.current({ email: 'staff@realproject.com' });
    });

    expect(screen.getByText('loading: false')).toBeInTheDocument();
    expect(screen.getByText('authenticated: true')).toBeInTheDocument();
  });

  it('delegates signIn to signInWithEmailAndPassword', async () => {
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );

    await act(async () => {
      screen.getByText('sign in').click();
    });

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      { name: 'mock-auth' },
      'staff@realproject.com',
      'secret',
    );
  });

  it('delegates signOut to Firebase signOut', async () => {
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );

    await act(async () => {
      screen.getByText('sign out').click();
    });

    expect(signOut).toHaveBeenCalledWith({ name: 'mock-auth' });
  });
});
