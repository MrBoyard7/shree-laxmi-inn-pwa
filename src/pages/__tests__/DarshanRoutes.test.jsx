import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { DataProvider } from '../../context/DataContext';
import DarshanRoutes from '../DarshanRoutes';

function renderPage() {
  return render(
    <MemoryRouter>
      <DataProvider>
        <DarshanRoutes />
      </DataProvider>
    </MemoryRouter>,
  );
}

describe('DarshanRoutes page', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('shows the 2-hour route by default with its ordered stops', async () => {
    renderPage();
    expect(await screen.findByText('Express Darshan')).toBeInTheDocument();
    expect(screen.getByText('Ram Janmabhoomi Temple')).toBeInTheDocument();
    expect(screen.getByText('Hanuman Garhi')).toBeInTheDocument();
  });

  it('switches to the full-day route when its tab is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    renderPage();
    await screen.findByText('Express Darshan');

    await user.click(screen.getByRole('button', { name: 'Full Day' }));

    expect(await screen.findByText('Complete Ayodhya Circuit')).toBeInTheDocument();
    expect(screen.getByText('Guptar Ghat')).toBeInTheDocument();
  });
});
