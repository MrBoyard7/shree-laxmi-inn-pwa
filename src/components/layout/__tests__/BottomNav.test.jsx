import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BottomNav from '../BottomNav';

describe('BottomNav', () => {
  it('renders a link for every primary section', () => {
    render(
      <MemoryRouter>
        <BottomNav />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: /Home/ })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /Guide/ })).toHaveAttribute('href', '/darshan-guide');
    expect(screen.getByRole('link', { name: /Routes/ })).toHaveAttribute('href', '/darshan-routes');
    expect(screen.getByRole('link', { name: /Stay/ })).toHaveAttribute('href', '/guesthouse-info');
    expect(screen.getByRole('link', { name: /SOS/ })).toHaveAttribute(
      'href',
      '/emergency-contacts',
    );
  });

  it('marks the current route as active', () => {
    render(
      <MemoryRouter initialEntries={['/darshan-routes']}>
        <BottomNav />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: /Routes/ })).toHaveClass('text-maroon-500');
    expect(screen.getByRole('link', { name: /Home/ })).not.toHaveClass('text-maroon-500');
  });
});
