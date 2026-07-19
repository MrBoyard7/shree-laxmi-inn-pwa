import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';

function Probe() {
  const { isAuthenticated, isDemoAuth, demoCredentials, user, signIn, signOut } = useAuth();
  return (
    <div>
      <p>authenticated: {String(isAuthenticated)}</p>
      <p>demo: {String(isDemoAuth)}</p>
      <p>email: {user?.email || 'none'}</p>
      <button type="button" onClick={() => signIn(demoCredentials.email, demoCredentials.password)}>
        sign in
      </button>
      <button
        type="button"
        onClick={async () => {
          try {
            await signIn('wrong@example.com', 'wrong');
          } catch (error) {
            document.title = error.message;
          }
        }}
      >
        sign in wrong
      </button>
      <button type="button" onClick={() => signOut()}>
        sign out
      </button>
    </div>
  );
}

function renderProbe() {
  return render(
    <AuthProvider>
      <Probe />
    </AuthProvider>,
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('starts unauthenticated in demo mode with no stored session', () => {
    renderProbe();
    expect(screen.getByText('authenticated: false')).toBeInTheDocument();
    expect(screen.getByText('demo: true')).toBeInTheDocument();
  });

  it('authenticates with the correct demo credentials and persists the session', async () => {
    renderProbe();
    await act(async () => {
      screen.getByText('sign in').click();
    });
    expect(screen.getByText('authenticated: true')).toBeInTheDocument();
    expect(screen.getByText('email: admin@shreelaxmiinn.example')).toBeInTheDocument();
    expect(window.localStorage.getItem('shree-laxmi-inn:demo-admin-session')).toBe(
      'admin@shreelaxmiinn.example',
    );
  });

  it('rejects incorrect demo credentials', async () => {
    renderProbe();
    await act(async () => {
      screen.getByText('sign in wrong').click();
    });
    expect(document.title).toBe('Invalid email or password.');
    expect(screen.getByText('authenticated: false')).toBeInTheDocument();
  });

  it('signs out and clears the stored session', async () => {
    renderProbe();
    await act(async () => {
      screen.getByText('sign in').click();
    });
    expect(screen.getByText('authenticated: true')).toBeInTheDocument();

    await act(async () => {
      screen.getByText('sign out').click();
    });

    expect(screen.getByText('authenticated: false')).toBeInTheDocument();
    expect(window.localStorage.getItem('shree-laxmi-inn:demo-admin-session')).toBeNull();
  });

  it('picks up an existing demo session on mount', () => {
    window.localStorage.setItem(
      'shree-laxmi-inn:demo-admin-session',
      'admin@shreelaxmiinn.example',
    );
    renderProbe();
    expect(screen.getByText('authenticated: true')).toBeInTheDocument();
  });

  it('throws when useAuth is used outside of an AuthProvider', () => {
    function Bare() {
      useAuth();
      return null;
    }
    // Suppress the expected React error boundary console noise for this case.
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Bare />)).toThrow('useAuth must be used within an AuthProvider');
    consoleError.mockRestore();
  });
});
