import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { DataProvider } from '../../../context/DataContext';
import RoutesEditor from '../RoutesEditor';

function renderPage() {
  return render(
    <MemoryRouter>
      <DataProvider>
        <RoutesEditor />
      </DataProvider>
    </MemoryRouter>,
  );
}

describe('RoutesEditor', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('shows the 2-hour route stops by default', async () => {
    renderPage();
    expect(await screen.findByDisplayValue('Express Darshan')).toBeInTheDocument();
    expect(screen.getByText('Ram Janmabhoomi Temple')).toBeInTheDocument();
    expect(screen.getByText('Hanuman Garhi')).toBeInTheDocument();
  });

  it('switches tabs to show the full-day route', async () => {
    const user = userEvent.setup({ delay: null });
    renderPage();
    await screen.findByDisplayValue('Express Darshan');

    await user.click(screen.getByRole('button', { name: 'Full Day' }));

    expect(await screen.findByDisplayValue('Complete Ayodhya Circuit')).toBeInTheDocument();
  });

  it('edits the title, description and suggested transport fields', async () => {
    const user = userEvent.setup({ delay: null });
    renderPage();
    const title = await screen.findByDisplayValue('Express Darshan');

    await user.clear(title);
    await user.type(title, 'Quick Darshan');
    expect(title).toHaveValue('Quick Darshan');

    const description = screen.getByLabelText('Description');
    await user.clear(description);
    await user.type(description, 'An updated description.');
    expect(description).toHaveValue('An updated description.');

    const transport = screen.getByLabelText('Suggested transport');
    await user.clear(transport);
    await user.type(transport, 'Bicycle');
    expect(transport).toHaveValue('Bicycle');
  });

  it('removes a stop from the route', async () => {
    const user = userEvent.setup({ delay: null });
    renderPage();
    await screen.findByDisplayValue('Express Darshan');

    await user.click(screen.getAllByLabelText('Remove stop')[0]);

    const stopsList = screen.getByRole('list');
    expect(within(stopsList).queryByText('Ram Janmabhoomi Temple')).not.toBeInTheDocument();
  });

  it('adds a stop back from the dropdown after removing it', async () => {
    const user = userEvent.setup({ delay: null });
    renderPage();
    await screen.findByDisplayValue('Express Darshan');

    await user.click(screen.getAllByLabelText('Remove stop')[0]);
    await user.selectOptions(screen.getByRole('combobox'), 'Ram Janmabhoomi Temple');

    const stopsList = screen.getByRole('list');
    expect(within(stopsList).getByText('Ram Janmabhoomi Temple')).toBeInTheDocument();
  });

  it('reorders stops with the move-down button', async () => {
    const user = userEvent.setup({ delay: null });
    renderPage();
    await screen.findByDisplayValue('Express Darshan');

    await user.click(screen.getAllByLabelText('Move down')[0]);

    const stopLabels = screen.getAllByText(/Ram Janmabhoomi Temple|Hanuman Garhi/);
    expect(stopLabels[0]).toHaveTextContent('Hanuman Garhi');
  });

  it('saves the routes and shows a confirmation', async () => {
    const user = userEvent.setup({ delay: null });
    renderPage();
    await screen.findByDisplayValue('Express Darshan');

    await user.click(screen.getByRole('button', { name: /Save routes/ }));

    expect(await screen.findByText('Saved ✓')).toBeInTheDocument();
  });

  it('shows "No routes yet" when the route list is empty', async () => {
    window.localStorage.setItem('shree-laxmi-inn:routes', JSON.stringify([]));
    renderPage();
    expect(await screen.findByText('No routes yet.')).toBeInTheDocument();
  });
});
