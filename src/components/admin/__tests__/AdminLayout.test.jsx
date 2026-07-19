import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../../../context/AuthContext';
import AdminLayout from '../AdminLayout';

function AdminHome() {
  return <p>Temples list</p>;
}

function LoginPage() {
  return <p>Login page</p>;
}

function renderLayout() {
  // A demo session is written directly to localStorage (the same
  // mechanism AuthContext itself uses) so the layout renders as if the
  // staff member had already signed in, without an impure render-time
  // side effect.
  window.localStorage.setItem('shree-laxmi-inn:demo-admin-session', 'admin@shreelaxmiinn.example');

  return render(
    <MemoryRouter initialEntries={['/admin']}>
      <AuthProvider>
        <Routes>
          <Route path="/admin/login" element={<LoginPage />} />
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminHome />} />
          </Route>
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('AdminLayout', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('shows "(demo mode)" next to the signed-in email', async () => {
    renderLayout();
    expect(await screen.findByText(/demo mode/)).toBeInTheDocument();
    expect(screen.getByText('Temples list')).toBeInTheDocument();
  });

  it('renders a link for every admin section', async () => {
    renderLayout();
    await screen.findByText('Temples list');
    expect(screen.getByRole('link', { name: 'Temples' })).toHaveAttribute('href', '/admin');
    expect(screen.getByRole('link', { name: 'Routes' })).toHaveAttribute('href', '/admin/routes');
    expect(screen.getByRole('link', { name: 'Guesthouse' })).toHaveAttribute(
      'href',
      '/admin/guesthouse',
    );
    expect(screen.getByRole('link', { name: 'Contacts' })).toHaveAttribute(
      'href',
      '/admin/contacts',
    );
  });

  it('signs out and returns to the login page', async () => {
    const user = userEvent.setup({ delay: null });
    renderLayout();
    await screen.findByText('Temples list');

    await user.click(screen.getByRole('button', { name: 'Sign out' }));

    expect(await screen.findByText('Login page')).toBeInTheDocument();
  });
});
