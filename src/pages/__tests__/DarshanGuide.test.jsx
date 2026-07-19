import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { DataProvider } from '../../context/DataContext';
import DarshanGuide from '../DarshanGuide';

function renderPage() {
  return render(
    <MemoryRouter>
      <DataProvider>
        <DarshanGuide />
      </DataProvider>
    </MemoryRouter>,
  );
}

describe('DarshanGuide page', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('shows the temple count and every temple once loaded', async () => {
    renderPage();
    expect(await screen.findByText('Ram Janmabhoomi Temple')).toBeInTheDocument();
    expect(screen.getByText('22 temples & sacred sites')).toBeInTheDocument();
    expect(screen.getByText('Hanuman Garhi')).toBeInTheDocument();
  });

  it('filters the list when a category chip is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    renderPage();
    await screen.findByText('Ram Janmabhoomi Temple');

    await user.click(screen.getByRole('button', { name: 'Ghat' }));

    expect(screen.getByText('Guptar Ghat')).toBeInTheDocument();
    expect(screen.queryByText('Ram Janmabhoomi Temple')).not.toBeInTheDocument();
  });

  it('returns to the full list when "All" is clicked again', async () => {
    const user = userEvent.setup({ delay: null });
    renderPage();
    await screen.findByText('Ram Janmabhoomi Temple');

    await user.click(screen.getByRole('button', { name: 'Ghat' }));
    await user.click(screen.getByRole('button', { name: 'All' }));

    expect(screen.getByText('Ram Janmabhoomi Temple')).toBeInTheDocument();
  });

  it('shows an empty state when a category has no temples', async () => {
    const { temples } = await import('../../data/temples.seed');
    const withoutParks = temples.filter((t) => t.category !== 'Park & Memorial');
    window.localStorage.setItem('shree-laxmi-inn:temples', JSON.stringify(withoutParks));

    const user = userEvent.setup({ delay: null });
    renderPage();
    await screen.findByText('Ram Janmabhoomi Temple');

    await user.click(screen.getByRole('button', { name: 'Park & Memorial' }));

    expect(await screen.findByText('No sites in this category yet')).toBeInTheDocument();
  });
});
