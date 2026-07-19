import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DataProvider } from '../../context/DataContext';
import EmergencyContacts from '../EmergencyContacts';

function renderPage() {
  return render(
    <MemoryRouter>
      <DataProvider>
        <EmergencyContacts />
      </DataProvider>
    </MemoryRouter>,
  );
}

describe('EmergencyContacts page', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders the national emergency numbers as tappable call links', async () => {
    renderPage();
    expect(await screen.findByText('112')).toBeInTheDocument();
    const policyLink = screen.getByText('100').closest('a');
    expect(policyLink).toHaveAttribute('href', 'tel:100');
  });

  it('shows an "Add number" placeholder instead of a call link for the unverified hospital entry', async () => {
    renderPage();
    await screen.findByText('112');
    expect(screen.getByText('Add number')).toBeInTheDocument();
  });
});
