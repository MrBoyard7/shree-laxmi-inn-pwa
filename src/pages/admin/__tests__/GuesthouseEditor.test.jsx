import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { DataProvider } from '../../../context/DataContext';
import GuesthouseEditor from '../GuesthouseEditor';

function renderPage() {
  return render(
    <MemoryRouter>
      <DataProvider>
        <GuesthouseEditor />
      </DataProvider>
    </MemoryRouter>,
  );
}

describe('GuesthouseEditor', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('pre-fills the form with the current guesthouse info', async () => {
    renderPage();
    expect(await screen.findByDisplayValue('Shree Laxmi Inn')).toBeInTheDocument();
    expect(screen.getByDisplayValue('12:00 PM')).toBeInTheDocument();
    expect(screen.getByDisplayValue('11:00 AM')).toBeInTheDocument();
  });

  it('edits the tagline and address fields', async () => {
    const user = userEvent.setup({ delay: null });
    renderPage();
    await screen.findByDisplayValue('Shree Laxmi Inn');

    const tagline = screen.getByLabelText('Tagline');
    await user.clear(tagline);
    await user.type(tagline, 'A new tagline');
    expect(tagline).toHaveValue('A new tagline');

    const address = screen.getByLabelText('Address');
    await user.clear(address);
    await user.type(address, '123 Ram Path, Ayodhya');
    expect(address).toHaveValue('123 Ram Path, Ayodhya');
  });

  it('edits the check-in and check-out times', async () => {
    const user = userEvent.setup({ delay: null });
    renderPage();
    await screen.findByDisplayValue('Shree Laxmi Inn');

    const checkIn = screen.getByLabelText('Check-in');
    await user.clear(checkIn);
    await user.type(checkIn, '1:00 PM');
    expect(checkIn).toHaveValue('1:00 PM');

    const checkOut = screen.getByLabelText('Check-out');
    await user.clear(checkOut);
    await user.type(checkOut, '10:00 AM');
    expect(checkOut).toHaveValue('10:00 AM');
  });

  it('edits the parking and Wi-Fi fields', async () => {
    const user = userEvent.setup({ delay: null });
    renderPage();
    await screen.findByDisplayValue('Shree Laxmi Inn');

    const parking = screen.getByLabelText('Parking');
    await user.clear(parking);
    await user.type(parking, 'Valet parking.');
    expect(parking).toHaveValue('Valet parking.');

    const wifi = screen.getByLabelText('Wi-Fi');
    await user.clear(wifi);
    await user.type(wifi, 'Fibre Wi-Fi.');
    expect(wifi).toHaveValue('Fibre Wi-Fi.');
  });

  it('edits the Google Review link and Google Maps search text', async () => {
    const user = userEvent.setup({ delay: null });
    renderPage();
    await screen.findByDisplayValue('Shree Laxmi Inn');

    const reviewLink = screen.getByLabelText('Google Review link');
    await user.clear(reviewLink);
    await user.type(reviewLink, 'https://g.page/r/example/review');
    expect(reviewLink).toHaveValue('https://g.page/r/example/review');

    const mapsQuery = screen.getByLabelText('Google Maps search text');
    await user.clear(mapsQuery);
    await user.type(mapsQuery, 'Shree Laxmi Inn, Ayodhya');
    expect(mapsQuery).toHaveValue('Shree Laxmi Inn, Ayodhya');
  });

  it('edits the reception phone number', async () => {
    const user = userEvent.setup({ delay: null });
    renderPage();
    await screen.findByDisplayValue('Shree Laxmi Inn');

    const phone = screen.getByLabelText(/^Phone \(with country code/);
    await user.clear(phone);
    await user.type(phone, '+911234567890');
    expect(phone).toHaveValue('+911234567890');
  });

  it('edits the reception WhatsApp number', async () => {
    const user = userEvent.setup({ delay: null });
    renderPage();
    await screen.findByDisplayValue('Shree Laxmi Inn');

    const whatsapp = screen.getByLabelText(/^WhatsApp number/);
    await user.clear(whatsapp);
    await user.type(whatsapp, '911234567890');
    expect(whatsapp).toHaveValue('911234567890');
  });

  it('adds and removes a house rule', async () => {
    const user = userEvent.setup({ delay: null });
    renderPage();
    await screen.findByDisplayValue('Shree Laxmi Inn');

    const before = screen.getAllByLabelText('Remove rule').length;
    await user.click(screen.getByText('+ Add rule'));
    expect(screen.getAllByLabelText('Remove rule')).toHaveLength(before + 1);

    await user.click(screen.getAllByLabelText('Remove rule')[0]);
    expect(screen.getAllByLabelText('Remove rule')).toHaveLength(before);
  });

  it('updates the guesthouse name and saves', async () => {
    const user = userEvent.setup({ delay: null });
    renderPage();
    const nameInput = await screen.findByDisplayValue('Shree Laxmi Inn');

    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Guesthouse Name');
    await user.click(screen.getByRole('button', { name: /Save changes/ }));

    expect(await screen.findByText('Saved ✓')).toBeInTheDocument();
  });
});
