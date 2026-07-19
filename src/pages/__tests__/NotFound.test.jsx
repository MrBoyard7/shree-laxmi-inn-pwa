import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFound from '../NotFound';

describe('NotFound page', () => {
  it('renders a message and a link back home', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );

    expect(screen.getByText('Page not found')).toBeInTheDocument();
    expect(screen.getByText('Go home')).toHaveAttribute('href', '/');
  });
});
