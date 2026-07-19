import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { DataProvider } from '../../../context/DataContext';
import ContactsEditor from '../ContactsEditor';

function renderPage() {
  return render(
    <MemoryRouter>
      <DataProvider>
        <ContactsEditor />
      </DataProvider>
    </MemoryRouter>,
  );
}

describe('ContactsEditor', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('pre-fills the form with the existing emergency contacts', async () => {
    renderPage();
    expect(await screen.findByDisplayValue(/National Emergency Number/)).toBeInTheDocument();
    expect(screen.getByDisplayValue('112')).toBeInTheDocument();
  });

  it('edits the label, phone and note of an existing contact', async () => {
    const user = userEvent.setup({ delay: null });
    renderPage();
    const phoneInput = await screen.findByDisplayValue('112');
    const fieldset = phoneInput.closest('fieldset');

    const labelInput = within(fieldset).getByDisplayValue(/National Emergency Number/);
    await user.clear(labelInput);
    await user.type(labelInput, 'Emergency Hotline');
    expect(labelInput).toHaveValue('Emergency Hotline');

    await user.clear(phoneInput);
    await user.type(phoneInput, '999');
    expect(phoneInput).toHaveValue('999');

    const noteInput = within(fieldset).getByDisplayValue(/unified emergency number/);
    await user.clear(noteInput);
    await user.type(noteInput, 'Updated note.');
    expect(noteInput).toHaveValue('Updated note.');
  });

  it('adds a new blank contact', async () => {
    const user = userEvent.setup({ delay: null });
    renderPage();
    await screen.findByDisplayValue('112');

    const before = screen.getAllByText('Remove').length;
    await user.click(screen.getByText('+ Add contact'));
    const after = screen.getAllByText('Remove').length;

    expect(after).toBe(before + 1);
  });

  it('removes a contact', async () => {
    const user = userEvent.setup({ delay: null });
    renderPage();
    await screen.findByDisplayValue('112');

    const before = screen.getAllByText('Remove').length;
    await user.click(screen.getAllByText('Remove')[0]);
    const after = screen.getAllByText('Remove').length;

    expect(after).toBe(before - 1);
  });

  it('saves the contacts and shows a confirmation', async () => {
    const user = userEvent.setup({ delay: null });
    renderPage();
    await screen.findByDisplayValue('112');

    await user.click(screen.getByRole('button', { name: /Save contacts/ }));

    expect(await screen.findByText('Saved ✓')).toBeInTheDocument();
  });
});
