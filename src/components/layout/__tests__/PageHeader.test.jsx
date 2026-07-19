import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PageHeader from '../PageHeader';

function Previous() {
  return <p>Previous page</p>;
}

function Current() {
  return <PageHeader title="Ayodhya Darshan Guide" subtitle="22 temples" />;
}

describe('PageHeader', () => {
  it('renders the title and subtitle', () => {
    render(
      <MemoryRouter>
        <PageHeader title="Guesthouse Information" subtitle="Shree Laxmi Inn" />
      </MemoryRouter>,
    );

    expect(screen.getByText('Guesthouse Information')).toBeInTheDocument();
    expect(screen.getByText('Shree Laxmi Inn')).toBeInTheDocument();
  });

  it('renders without a subtitle when none is given', () => {
    render(
      <MemoryRouter>
        <PageHeader title="Darshan Routes" />
      </MemoryRouter>,
    );
    expect(screen.getByText('Darshan Routes')).toBeInTheDocument();
  });

  it('navigates back when the back button is pressed', async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <MemoryRouter initialEntries={['/previous', '/current']} initialIndex={1}>
        <Routes>
          <Route path="/previous" element={<Previous />} />
          <Route path="/current" element={<Current />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Ayodhya Darshan Guide')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Go back' }));
    expect(await screen.findByText('Previous page')).toBeInTheDocument();
  });
});
