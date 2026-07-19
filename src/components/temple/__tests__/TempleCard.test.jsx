import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TempleCard from '../TempleCard';

const temple = {
  id: '01',
  name: 'Hanuman Garhi',
  category: 'Major Temple',
  shortDescription: 'A hilltop fortress-temple dedicated to Hanuman.',
  photos: [],
  aarti: [{ name: 'Mangala Aarti', time: '05:00' }],
};

describe('TempleCard', () => {
  it('renders the temple name, category and next aarti time', () => {
    render(
      <MemoryRouter>
        <TempleCard temple={temple} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Hanuman Garhi')).toBeInTheDocument();
    expect(screen.getByText('Major Temple')).toBeInTheDocument();
    expect(screen.getByText(/5:00 AM/)).toBeInTheDocument();
  });

  it('links to the temple detail page', () => {
    render(
      <MemoryRouter>
        <TempleCard temple={temple} />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link')).toHaveAttribute('href', '/darshan-guide/01');
  });

  it('renders the uploaded photo instead of the placeholder when one exists', () => {
    render(
      <MemoryRouter>
        <TempleCard temple={{ ...temple, photos: ['https://example.com/hanuman-garhi.jpg'] }} />
      </MemoryRouter>,
    );

    expect(screen.getByAltText('Hanuman Garhi')).toHaveAttribute(
      'src',
      'https://example.com/hanuman-garhi.jpg',
    );
  });
});
