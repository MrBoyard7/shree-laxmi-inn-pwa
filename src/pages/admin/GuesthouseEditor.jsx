import { useState } from 'react';
import PropTypes from 'prop-types';
import { useData } from '../../context/DataContext';
import { LoadingSpinner } from '../../components/common/Misc';

function GuesthouseForm({ info, onSave }) {
  const [form, setForm] = useState(info);
  const [status, setStatus] = useState('');

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));
  const updateReception = (patch) =>
    update({ reception: { ...form.reception, ...patch, isSampleData: false } });

  const updateRule = (index, value) => {
    const houseRules = form.houseRules.map((rule, i) => (i === index ? value : rule));
    update({ houseRules });
  };
  const addRule = () => update({ houseRules: [...form.houseRules, ''] });
  const removeRule = (index) =>
    update({ houseRules: form.houseRules.filter((_, i) => i !== index) });

  const handleSave = async (event) => {
    event.preventDefault();
    setStatus('saving');
    await onSave(form);
    setStatus('saved');
    setTimeout(() => setStatus(''), 2000);
  };

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-4">
      <h2 className="font-display text-lg text-indigo-500">Guesthouse information</h2>

      <label className="flex flex-col gap-1 text-sm text-ink-700">
        Guesthouse name
        <input
          value={form.name}
          onChange={(e) => update({ name: e.target.value })}
          className="rounded-lg border border-indigo-500/15 px-3 py-2 text-sm outline-none focus:border-maroon-500"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-ink-700">
        Tagline
        <input
          value={form.tagline}
          onChange={(e) => update({ tagline: e.target.value })}
          className="rounded-lg border border-indigo-500/15 px-3 py-2 text-sm outline-none focus:border-maroon-500"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-ink-700">
        Address
        <input
          value={form.address}
          onChange={(e) => update({ address: e.target.value })}
          className="rounded-lg border border-indigo-500/15 px-3 py-2 text-sm outline-none focus:border-maroon-500"
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm text-ink-700">
          Check-in
          <input
            value={form.checkIn}
            onChange={(e) => update({ checkIn: e.target.value })}
            className="rounded-lg border border-indigo-500/15 px-3 py-2 text-sm outline-none focus:border-maroon-500"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink-700">
          Check-out
          <input
            value={form.checkOut}
            onChange={(e) => update({ checkOut: e.target.value })}
            className="rounded-lg border border-indigo-500/15 px-3 py-2 text-sm outline-none focus:border-maroon-500"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm text-ink-700">
        Parking
        <textarea
          rows={2}
          value={form.parking}
          onChange={(e) => update({ parking: e.target.value })}
          className="rounded-lg border border-indigo-500/15 px-3 py-2 text-sm outline-none focus:border-maroon-500"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-ink-700">
        Wi-Fi
        <textarea
          rows={2}
          value={form.wifi}
          onChange={(e) => update({ wifi: e.target.value })}
          className="rounded-lg border border-indigo-500/15 px-3 py-2 text-sm outline-none focus:border-maroon-500"
        />
      </label>

      <fieldset className="rounded-lg border border-indigo-500/15 p-3">
        <legend className="px-1 text-sm font-semibold text-ink-700">House rules</legend>
        <div className="flex flex-col gap-2">
          {form.houseRules.map((rule, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                value={rule}
                onChange={(e) => updateRule(index, e.target.value)}
                className="flex-1 rounded-lg border border-indigo-500/15 px-2.5 py-1.5 text-sm outline-none focus:border-maroon-500"
              />
              <button
                type="button"
                onClick={() => removeRule(index)}
                aria-label="Remove rule"
                className="rounded-lg bg-maroon-500/10 px-2 py-1.5 text-xs font-semibold text-maroon-500"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addRule}
          className="mt-2 rounded-lg bg-indigo-500/10 px-3 py-1.5 font-utility text-xs font-semibold text-indigo-500"
        >
          + Add rule
        </button>
      </fieldset>

      <fieldset className="rounded-lg border border-indigo-500/15 p-3">
        <legend className="px-1 text-sm font-semibold text-ink-700">Reception contact</legend>
        <div className="flex flex-col gap-2">
          <label className="flex flex-col gap-1 text-sm text-ink-700">
            Phone (with country code, e.g. +91XXXXXXXXXX)
            <input
              value={form.reception.phone}
              onChange={(e) => updateReception({ phone: e.target.value })}
              className="rounded-lg border border-indigo-500/15 px-2.5 py-1.5 text-sm outline-none focus:border-maroon-500"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-ink-700">
            WhatsApp number (digits only, with country code)
            <input
              value={form.reception.whatsapp}
              onChange={(e) => updateReception({ whatsapp: e.target.value })}
              className="rounded-lg border border-indigo-500/15 px-2.5 py-1.5 text-sm outline-none focus:border-maroon-500"
            />
          </label>
        </div>
      </fieldset>

      <label className="flex flex-col gap-1 text-sm text-ink-700">
        Google Review link
        <input
          value={form.googleReviewUrl}
          onChange={(e) => update({ googleReviewUrl: e.target.value })}
          className="rounded-lg border border-indigo-500/15 px-3 py-2 text-sm outline-none focus:border-maroon-500"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-ink-700">
        Google Maps search text
        <input
          value={form.mapsQuery}
          onChange={(e) => update({ mapsQuery: e.target.value })}
          className="rounded-lg border border-indigo-500/15 px-3 py-2 text-sm outline-none focus:border-maroon-500"
        />
      </label>

      <button
        type="submit"
        className="rounded-lg bg-maroon-500 py-2.5 font-utility text-sm font-semibold text-parchment-50"
      >
        {status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved ✓' : 'Save changes'}
      </button>
    </form>
  );
}

GuesthouseForm.propTypes = {
  info: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default function GuesthouseEditor() {
  const { guesthouseInfo, isLoading, actions } = useData();

  if (isLoading || !guesthouseInfo) return <LoadingSpinner label="Loading guesthouse info…" />;

  // Keying by a stable marker means this form mounts fresh exactly once
  // real data is available, so its local state can initialize straight
  // from props with useState — no effect required to "sync" it in.
  return (
    <GuesthouseForm
      key="guesthouse-form"
      info={guesthouseInfo}
      onSave={actions.saveGuesthouseInfo}
    />
  );
}
