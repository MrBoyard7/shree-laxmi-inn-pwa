import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from '../../../context/DataContext';
import TempleEditor from '../TempleEditor';

function AdminHome() {
  return <p>Temples list</p>;
}

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <DataProvider>
        <Routes>
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/admin/temples/:templeId" element={<TempleEditor />} />
        </Routes>
      </DataProvider>
    </MemoryRouter>,
  );
}

describe('TempleEditor - add new temple', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('starts with empty required fields and the first category selected', () => {
    renderAt('/admin/temples/new');
    expect(screen.getByText('Add temple')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toHaveValue('');
    expect(screen.getByLabelText('Category')).toHaveValue('Major Temple');
  });

  it('fills in the name, category and text fields', async () => {
    const user = userEvent.setup({ delay: null });
    renderAt('/admin/temples/new');

    await user.type(screen.getByLabelText('Name'), 'Test Temple');
    await user.selectOptions(screen.getByLabelText('Category'), 'Ghat');
    expect(screen.getByLabelText('Category')).toHaveValue('Ghat');

    await user.type(screen.getByLabelText('Short description'), 'A test temple.');
    await user.type(screen.getByLabelText('History'), 'Sample history text.');
    await user.type(screen.getByLabelText('Address'), '123 Sample Road, Ayodhya');
    await user.type(screen.getByLabelText('Google Maps search text'), 'Test Temple, Ayodhya');

    expect(screen.getByLabelText('Name')).toHaveValue('Test Temple');
  });

  it('edits the opening and closing times', async () => {
    const user = userEvent.setup({ delay: null });
    renderAt('/admin/temples/new');

    const opensAt = screen.getByLabelText('Opens at');
    await user.clear(opensAt);
    await user.type(opensAt, '05:30');
    expect(opensAt).toHaveValue('05:30');

    const closesAt = screen.getByLabelText('Closes at');
    await user.clear(closesAt);
    await user.type(closesAt, '21:30');
    expect(closesAt).toHaveValue('21:30');
  });

  it('adds and removes an aarti time row', async () => {
    const user = userEvent.setup({ delay: null });
    renderAt('/admin/temples/new');

    await user.click(screen.getByText('+ Add aarti time'));
    expect(screen.getByPlaceholderText('Aarti name')).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText('Aarti name'), 'Sandhya Aarti');
    expect(screen.getByPlaceholderText('Aarti name')).toHaveValue('Sandhya Aarti');

    await user.click(screen.getByLabelText('Remove aarti'));
    expect(screen.queryByPlaceholderText('Aarti name')).not.toBeInTheDocument();
  });

  it('shows an error and does not add the photo when the upload fails', async () => {
    const user = userEvent.setup({ delay: null });
    renderAt('/admin/temples/new');

    const bigContent = new Uint8Array(2 * 1024 * 1024);
    const file = new File([bigContent], 'huge.png', { type: 'image/png' });
    const input = document.querySelector('input[type="file"]');
    await user.upload(input, file);

    expect(await screen.findByText(/too large for local demo mode/)).toBeInTheDocument();
    expect(document.querySelectorAll('img')).toHaveLength(0);
  });

  it('saves a new temple and returns to the dashboard', async () => {
    const user = userEvent.setup({ delay: null });
    renderAt('/admin/temples/new');

    await user.type(screen.getByLabelText('Name'), 'Test Temple');
    await user.type(screen.getByLabelText('Short description'), 'A test temple.');
    await user.type(screen.getByLabelText('Google Maps search text'), 'Test Temple, Ayodhya');
    await user.click(screen.getByRole('button', { name: 'Save temple' }));

    expect(await screen.findByText('Temples list')).toBeInTheDocument();
  });

  it('returns to the dashboard when Cancel is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    renderAt('/admin/temples/new');
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(await screen.findByText('Temples list')).toBeInTheDocument();
  });
});

describe('TempleEditor - edit existing temple', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('pre-fills the form with the existing temple data', async () => {
    renderAt('/admin/temples/02');
    expect(await screen.findByText('Edit: Hanuman Garhi')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toHaveValue('Hanuman Garhi');
  });

  it('shows a "not found" message for an unknown temple id', async () => {
    renderAt('/admin/temples/does-not-exist');
    expect(await screen.findByText('Temple not found')).toBeInTheDocument();
    expect(screen.getByText('Back to the temple list')).toHaveAttribute('href', '/admin');
  });

  it('uploads a small photo in local demo mode, previews it, then removes it', async () => {
    const user = userEvent.setup({ delay: null });
    renderAt('/admin/temples/02');
    await screen.findByText('Edit: Hanuman Garhi');

    const file = new File(['tiny-image-content'], 'temple.png', { type: 'image/png' });
    const input = document.querySelector('input[type="file"]');
    await user.upload(input, file);

    expect(await screen.findByAltText('')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Remove photo'));
    expect(screen.queryByAltText('')).not.toBeInTheDocument();
  });

  it('saves changes to an existing temple', async () => {
    const user = userEvent.setup({ delay: null });
    renderAt('/admin/temples/02');
    const nameInput = await screen.findByLabelText('Name');

    await user.clear(nameInput);
    await user.type(nameInput, 'Hanuman Garhi Updated');
    await user.click(screen.getByRole('button', { name: 'Save temple' }));

    expect(await screen.findByText('Temples list')).toBeInTheDocument();
  });
});
