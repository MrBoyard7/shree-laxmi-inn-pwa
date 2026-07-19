import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DataProvider } from '../../context/DataContext';
import GuesthouseInfo from '../GuesthouseInfo';

function renderPage() {
  return render(
    <MemoryRouter>
      <DataProvider>
        <GuesthouseInfo />
      </DataProvider>
    </MemoryRouter>,
  );
}

describe('GuesthouseInfo page', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('shows check-in/out times, parking, wifi and house rules', async () => {
    renderPage();
    expect(await screen.findByText('12:00 PM')).toBeInTheDocument();
    expect(screen.getByText('11:00 AM')).toBeInTheDocument();
    expect(screen.getByText('House Rules')).toBeInTheDocument();
    expect(screen.getByText('Quiet hours are from 10:00 PM to 6:00 AM.')).toBeInTheDocument();
  });

  it('renders working Call and WhatsApp reception buttons', async () => {
    renderPage();
    await screen.findByText('House Rules');
    expect(screen.getByText('Call Reception').closest('a')).toHaveAttribute(
      'href',
      expect.stringContaining('tel:'),
    );
    expect(screen.getByText('WhatsApp Reception').closest('a')).toHaveAttribute(
      'href',
      expect.stringContaining('https://wa.me/'),
    );
  });
});
