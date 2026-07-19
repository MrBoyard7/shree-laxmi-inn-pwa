import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../../../context/AuthContext';
import ProtectedRoute from '../ProtectedRoute';

function LoginPage() {
  return <p>Login page</p>;
}

function AdminHome() {
  return <p>Admin home</p>;
}

function renderApp() {
  return render(
    <MemoryRouter initialEntries={['/admin']}>
      <AuthProvider>
        <Routes>
          <Route path="/admin/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminHome />} />
          </Route>
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('redirects to the login page when there is no active session', async () => {
    renderApp();
    expect(await screen.findByText('Login page')).toBeInTheDocument();
  });

  it('renders the protected content when a demo session already exists', async () => {
    window.localStorage.setItem(
      'shree-laxmi-inn:demo-admin-session',
      'admin@shreelaxmiinn.example',
    );
    renderApp();
    expect(await screen.findByText('Admin home')).toBeInTheDocument();
  });
});
