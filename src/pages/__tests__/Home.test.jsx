import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DataProvider } from '../../context/DataContext';
import Home from '../Home';

function renderHome() {
  return render(
    <MemoryRouter>
      <DataProvider>
        <Home />
      </DataProvider>
    </MemoryRouter>,
  );
}

describe('Home page', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('shows the guesthouse name once demo data has loaded', async () => {
    renderHome();
    expect(await screen.findByText('Shree Laxmi Inn')).toBeInTheDocument();
  });

  it('renders the four quick-action buttons', async () => {
    renderHome();
    await screen.findByText('Shree Laxmi Inn');
    expect(screen.getByText('Call')).toBeInTheDocument();
    expect(screen.getByText('WhatsApp')).toBeInTheDocument();
    expect(screen.getByText('Directions')).toBeInTheDocument();
    expect(screen.getByText('Review')).toBeInTheDocument();
  });

  it('renders links to all four feature pages', async () => {
    renderHome();
    await screen.findByText('Shree Laxmi Inn');
    expect(screen.getByText('Ayodhya Darshan Guide')).toBeInTheDocument();
    expect(screen.getByText('Darshan Routes')).toBeInTheDocument();
    expect(screen.getByText('Guesthouse Information')).toBeInTheDocument();
    expect(screen.getByText('Emergency Contacts')).toBeInTheDocument();
  });
});
