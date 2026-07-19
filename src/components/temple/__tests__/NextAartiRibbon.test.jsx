import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NextAartiRibbon from '../NextAartiRibbon';

const temples = [
  {
    id: '01',
    name: 'Ram Janmabhoomi Temple',
    aarti: [{ name: 'Sandhya Aarti', time: '19:00' }],
  },
];

function renderRibbon(list) {
  return render(
    <MemoryRouter>
      <NextAartiRibbon temples={list} />
    </MemoryRouter>,
  );
}

describe('NextAartiRibbon', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders nothing when no temple has any aarti scheduled', () => {
    const { container } = renderRibbon([{ id: '01', name: 'No Aarti Temple', aarti: [] }]);
    expect(container).toBeEmptyDOMElement();
  });

  it('links to the relevant temple and shows the aarti name', () => {
    renderRibbon(temples);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/darshan-guide/01');
    expect(screen.getByText(/Sandhya Aarti/)).toBeInTheDocument();
  });

  it('labels the countdown as "tomorrow" once every aarti for today has passed', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 1, 23, 0));

    renderRibbon(temples);

    expect(screen.getByText('Next aarti (tomorrow)')).toBeInTheDocument();
  });
});
