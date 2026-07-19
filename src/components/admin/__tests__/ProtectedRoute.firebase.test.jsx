import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

vi.mock('../../../firebase/config', () => ({
  auth: { name: 'mock-auth' },
  isFirebaseConfigured: true,
}));

vi.mock('firebase/auth', () => ({
  // Never calls back, so the provider stays in its initial loading state
  // for the lifetime of this test — exactly what we want to assert.
  onAuthStateChanged: vi.fn(() => vi.fn()),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
}));

const { AuthProvider } = await import('../../../context/AuthContext');
const { default: ProtectedRoute } = await import('../ProtectedRoute');

function AdminHome() {
  return <p>Admin home</p>;
}

describe('ProtectedRoute (Firebase configured, still loading)', () => {
  it('shows a loading spinner instead of redirecting or rendering the outlet', () => {
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AuthProvider>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminHome />} />
            </Route>
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText('Checking your session…')).toBeInTheDocument();
    expect(screen.queryByText('Admin home')).not.toBeInTheDocument();
  });
});
