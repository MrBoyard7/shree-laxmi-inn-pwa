import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { DataProvider } from '../../../context/DataContext';
import AdminDashboard from '../AdminDashboard';

function renderPage() {
  return render(
    <MemoryRouter>
      <DataProvider>
        <AdminDashboard />
      </DataProvider>
    </MemoryRouter>,
  );
}

describe('AdminDashboard', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('lists every temple with an edit link and shows the total count', async () => {
    renderPage();
    expect(await screen.findByText('Temples (22)')).toBeInTheDocument();
    expect(screen.getByText('Ram Janmabhoomi Temple')).toBeInTheDocument();
    expect(screen.getAllByText('Edit').length).toBeGreaterThan(0);
  });

  it('has a link to add a new temple', async () => {
    renderPage();
    await screen.findByText('Temples (22)');
    expect(screen.getByText('+ Add temple')).toHaveAttribute('href', '/admin/temples/new');
  });

  it('does not delete the temple when the confirmation is cancelled', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    const user = userEvent.setup({ delay: null });
    renderPage();
    await screen.findByText('Ram Janmabhoomi Temple');

    await user.click(screen.getAllByText('Delete')[0]);

    expect(window.confirm).toHaveBeenCalled();
    expect(screen.getByText('Ram Janmabhoomi Temple')).toBeInTheDocument();
  });

  it('deletes the temple when the confirmation is accepted', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const user = userEvent.setup({ delay: null });
    renderPage();
    await screen.findByText('Ram Janmabhoomi Temple');

    await user.click(screen.getAllByText('Delete')[0]);

    expect(await screen.findByText('Temples (21)')).toBeInTheDocument();
    expect(screen.queryByText('Ram Janmabhoomi Temple')).not.toBeInTheDocument();
  });

  it('shows an empty state when there are no temples at all', async () => {
    window.localStorage.setItem('shree-laxmi-inn:temples', JSON.stringify([]));
    renderPage();
    expect(await screen.findByText('No temples yet')).toBeInTheDocument();
  });
});
