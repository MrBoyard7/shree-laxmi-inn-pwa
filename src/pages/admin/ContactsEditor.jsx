import { useState } from 'react';
import PropTypes from 'prop-types';
import { useData } from '../../context/DataContext';
import { LoadingSpinner } from '../../components/common/Misc';
import { generateLocalId } from '../../services/localStore';

function ContactsForm({ initialContacts, onSave }) {
  const [contacts, setContacts] = useState(initialContacts);
  const [status, setStatus] = useState('');

  const updateContact = (id, patch) =>
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch, isSampleData: false } : c)),
    );

  const removeContact = (id) => setContacts((prev) => prev.filter((c) => c.id !== id));

  const addContact = () =>
    setContacts((prev) => [
      ...prev,
      { id: generateLocalId(), label: '', phone: '', note: '', isVerifiedNational: false },
    ]);

  const handleSave = async () => {
    setStatus('saving');
    await onSave(contacts);
    setStatus('saved');
    setTimeout(() => setStatus(''), 2000);
  };

  return (
    <div>
      <h2 className="font-display text-lg text-indigo-500">Emergency contacts</h2>
      <p className="mt-1 text-sm text-ink-500/70">
        National numbers (112, 100, 101, 108, 1363) are correct as shipped. Please verify and add
        your local hospital number.
      </p>

      <div className="mt-4 flex flex-col gap-3">
        {contacts.map((contact) => (
          <fieldset key={contact.id} className="rounded-lg border border-indigo-500/15 p-3">
            <div className="grid grid-cols-2 gap-2">
              <label className="col-span-2 flex flex-col gap-1 text-sm text-ink-700">
                Label
                <input
                  value={contact.label}
                  onChange={(e) => updateContact(contact.id, { label: e.target.value })}
                  className="rounded-lg border border-indigo-500/15 px-2.5 py-1.5 text-sm outline-none focus:border-maroon-500"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-ink-700">
                Phone
                <input
                  value={contact.phone}
                  onChange={(e) => updateContact(contact.id, { phone: e.target.value })}
                  className="rounded-lg border border-indigo-500/15 px-2.5 py-1.5 text-sm outline-none focus:border-maroon-500"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-ink-700">
                Note
                <input
                  value={contact.note}
                  onChange={(e) => updateContact(contact.id, { note: e.target.value })}
                  className="rounded-lg border border-indigo-500/15 px-2.5 py-1.5 text-sm outline-none focus:border-maroon-500"
                />
              </label>
            </div>
            <button
              type="button"
              onClick={() => removeContact(contact.id)}
              className="mt-2 rounded-lg bg-maroon-500/10 px-3 py-1 font-utility text-xs font-semibold text-maroon-500"
            >
              Remove
            </button>
          </fieldset>
        ))}

        <button
          type="button"
          onClick={addContact}
          className="rounded-lg bg-indigo-500/10 px-3 py-1.5 font-utility text-xs font-semibold text-indigo-500"
        >
          + Add contact
        </button>

        <button
          type="button"
          onClick={handleSave}
          className="rounded-lg bg-maroon-500 py-2.5 font-utility text-sm font-semibold text-parchment-50"
        >
          {status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved ✓' : 'Save contacts'}
        </button>
      </div>
    </div>
  );
}

ContactsForm.propTypes = {
  initialContacts: PropTypes.array.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default function ContactsEditor() {
  const { emergencyContacts, isLoading, actions } = useData();

  if (isLoading || emergencyContacts.length === 0) {
    return <LoadingSpinner label="Loading contacts…" />;
  }

  return (
    <ContactsForm
      key="contacts-form"
      initialContacts={emergencyContacts}
      onSave={actions.saveEmergencyContacts}
    />
  );
}
