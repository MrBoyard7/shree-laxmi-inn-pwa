import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from '../../context/DataContext';
import TempleDetail from '../TempleDetail';

function renderAt(templeId) {
  return render(
    <MemoryRouter initialEntries={[`/darshan-guide/${templeId}`]}>
      <DataProvider>
        <Routes>
          <Route path="/darshan-guide/:templeId" element={<TempleDetail />} />
        </Routes>
      </DataProvider>
    </MemoryRouter>,
  );
}

describe('TempleDetail page', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders the temple name, timings and aarti schedule', async () => {
    renderAt('02');
    expect(await screen.findByText('Hanuman Garhi')).toBeInTheDocument();
    expect(screen.getByText('Aarti Timings')).toBeInTheDocument();
    expect(screen.getByText('Mangala Aarti')).toBeInTheDocument();
    expect(screen.getByText(/Address \(approximate\)/)).toBeInTheDocument();
  });

  it('renders a working Google Maps navigation link', async () => {
    renderAt('02');
    await screen.findByText('Hanuman Garhi');
    const link = screen.getByText('Navigate with Google Maps').closest('a');
    expect(link).toHaveAttribute(
      'href',
      expect.stringContaining('https://www.google.com/maps/dir/'),
    );
  });

  it('shows a "not found" message and a link back for an unknown id', async () => {
    renderAt('does-not-exist');
    expect(await screen.findByText('Temple not found')).toBeInTheDocument();
    expect(screen.getByText('Back to the Darshan Guide')).toHaveAttribute('href', '/darshan-guide');
  });

  it('renders the uploaded photo instead of the placeholder when the temple has one', async () => {
    const { temples } = await import('../../data/temples.seed');
    const withPhoto = temples.map((t) =>
      t.id === '02' ? { ...t, photos: ['https://example.com/hanuman-garhi.jpg'] } : t,
    );
    window.localStorage.setItem('shree-laxmi-inn:temples', JSON.stringify(withPhoto));

    renderAt('02');

    expect(await screen.findByAltText('Hanuman Garhi')).toHaveAttribute(
      'src',
      'https://example.com/hanuman-garhi.jpg',
    );
  });
});
