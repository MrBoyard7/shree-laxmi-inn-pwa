import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../../../context/AuthContext';
import AdminLogin from '../AdminLogin';

function AdminHome() {
  return <p>Admin home</p>;
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/admin/login']}>
      <AuthProvider>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminHome />} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('AdminLogin page', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('shows the demo credentials hint in local demo mode', () => {
    renderPage();
    expect(screen.getByText(/Demo mode/)).toBeInTheDocument();
    expect(screen.getByText('admin@shreelaxmiinn.example')).toBeInTheDocument();
  });

  it('shows an error for invalid credentials', async () => {
    const user = userEvent.setup({ delay: null });
    renderPage();

    await user.type(screen.getByLabelText('Email'), 'wrong@example.com');
    await user.type(screen.getByLabelText('Password'), 'wrong-password');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(
      await screen.findByText('Invalid email or password. Please try again.'),
    ).toBeInTheDocument();
  });

  it('signs in and redirects to /admin with valid demo credentials', async () => {
    const user = userEvent.setup({ delay: null });
    renderPage();

    await user.type(screen.getByLabelText('Email'), 'admin@shreelaxmiinn.example');
    await user.type(screen.getByLabelText('Password'), 'ayodhya-demo');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByText('Admin home')).toBeInTheDocument();
  });
});
