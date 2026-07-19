import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { TEMPLE_CATEGORIES } from '../../data/temples.seed';
import { uploadTemplePhoto } from '../../services/photoUpload';
import { LoadingSpinner } from '../../components/common/Misc';

const EMPTY_TEMPLE = {
  name: '',
  category: TEMPLE_CATEGORIES[0],
  shortDescription: '',
  history: '',
  address: '',
  mapsQuery: '',
  timings: { open: '06:00', close: '20:00' },
  aarti: [],
  photos: [],
};

function TempleForm({ initialTemple, templeId = undefined, onSave }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialTemple);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  const updateAarti = (index, patch) => {
    const aarti = form.aarti.map((item, i) => (i === index ? { ...item, ...patch } : item));
    update({ aarti });
  };

  const addAarti = () => update({ aarti: [...form.aarti, { name: '', time: '18:00' }] });
  const removeAarti = (index) => update({ aarti: form.aarti.filter((_, i) => i !== index) });

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError('');
    setIsUploading(true);
    try {
      const url = await uploadTemplePhoto(file, templeId || 'new');
      update({ photos: [url, ...(form.photos || [])] });
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const removePhoto = (url) => update({ photos: form.photos.filter((p) => p !== url) });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError('');
    try {
      await onSave(form);
      navigate('/admin');
    } catch (saveError) {
      setError(saveError.message || 'Could not save this temple.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h2 className="font-display text-lg text-indigo-500">
        {templeId ? `Edit: ${initialTemple.name}` : 'Add temple'}
      </h2>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm text-ink-700">
          Name
          <input
            required
            value={form.name}
            onChange={(e) => update({ name: e.target.value })}
            className="rounded-lg border border-indigo-500/15 px-3 py-2 text-sm outline-none focus:border-maroon-500"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-ink-700">
          Category
          <select
            value={form.category}
            onChange={(e) => update({ category: e.target.value })}
            className="rounded-lg border border-indigo-500/15 px-3 py-2 text-sm outline-none focus:border-maroon-500"
          >
            {TEMPLE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm text-ink-700">
          Short description
          <textarea
            required
            rows={2}
            value={form.shortDescription}
            onChange={(e) => update({ shortDescription: e.target.value })}
            className="rounded-lg border border-indigo-500/15 px-3 py-2 text-sm outline-none focus:border-maroon-500"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-ink-700">
          History
          <textarea
            rows={3}
            value={form.history}
            onChange={(e) => update({ history: e.target.value })}
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

        <label className="flex flex-col gap-1 text-sm text-ink-700">
          Google Maps search text
          <input
            required
            value={form.mapsQuery}
            onChange={(e) => update({ mapsQuery: e.target.value })}
            placeholder="e.g. Hanuman Garhi, Ayodhya"
            className="rounded-lg border border-indigo-500/15 px-3 py-2 text-sm outline-none focus:border-maroon-500"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-sm text-ink-700">
            Opens at
            <input
              type="time"
              value={form.timings.open}
              onChange={(e) => update({ timings: { ...form.timings, open: e.target.value } })}
              className="rounded-lg border border-indigo-500/15 px-3 py-2 text-sm outline-none focus:border-maroon-500"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-ink-700">
            Closes at
            <input
              type="time"
              value={form.timings.close}
              onChange={(e) => update({ timings: { ...form.timings, close: e.target.value } })}
              className="rounded-lg border border-indigo-500/15 px-3 py-2 text-sm outline-none focus:border-maroon-500"
            />
          </label>
        </div>

        <fieldset className="rounded-lg border border-indigo-500/15 p-3">
          <legend className="px-1 text-sm font-semibold text-ink-700">Aarti timings</legend>
          <div className="flex flex-col gap-2">
            {form.aarti.map((aarti, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  value={aarti.name}
                  onChange={(e) => updateAarti(index, { name: e.target.value })}
                  placeholder="Aarti name"
                  className="flex-1 rounded-lg border border-indigo-500/15 px-2.5 py-1.5 text-sm outline-none focus:border-maroon-500"
                />
                <input
                  type="time"
                  value={aarti.time}
                  onChange={(e) => updateAarti(index, { time: e.target.value })}
                  className="rounded-lg border border-indigo-500/15 px-2.5 py-1.5 text-sm outline-none focus:border-maroon-500"
                />
                <button
                  type="button"
                  onClick={() => removeAarti(index)}
                  aria-label="Remove aarti"
                  className="rounded-lg bg-maroon-500/10 px-2 py-1.5 text-xs font-semibold text-maroon-500"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addAarti}
            className="mt-2 rounded-lg bg-indigo-500/10 px-3 py-1.5 font-utility text-xs font-semibold text-indigo-500"
          >
            + Add aarti time
          </button>
        </fieldset>

        <fieldset className="rounded-lg border border-indigo-500/15 p-3">
          <legend className="px-1 text-sm font-semibold text-ink-700">Photos</legend>
          <div className="flex flex-wrap gap-2">
            {(form.photos || []).map((url) => (
              <div key={url} className="relative h-16 w-16 overflow-hidden rounded-lg">
                <img src={url} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(url)}
                  aria-label="Remove photo"
                  className="absolute right-0 top-0 rounded-bl-lg bg-maroon-500 px-1.5 text-xs text-parchment-50"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            disabled={isUploading}
            className="mt-2 text-xs"
          />
          {isUploading && <p className="mt-1 text-xs text-indigo-500">Uploading…</p>}
        </fieldset>

        {error && <p className="text-sm text-maroon-500">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 rounded-lg bg-maroon-500 py-2.5 font-utility text-sm font-semibold text-parchment-50 disabled:opacity-60"
          >
            {isSaving ? 'Saving…' : 'Save temple'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="rounded-lg border border-indigo-500/20 px-4 py-2.5 font-utility text-sm font-semibold text-indigo-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

TempleForm.propTypes = {
  initialTemple: PropTypes.object.isRequired,
  templeId: PropTypes.string,
  onSave: PropTypes.func.isRequired,
};

export default function TempleEditor() {
  const { templeId } = useParams();
  const isNew = templeId === 'new';
  const { temples, isLoading, actions } = useData();

  if (!isNew && isLoading) return <LoadingSpinner label="Loading temple…" />;

  if (isNew) {
    return (
      <TempleForm
        key="new"
        initialTemple={EMPTY_TEMPLE}
        onSave={(data) => actions.addTemple(data)}
      />
    );
  }

  const existing = temples.find((t) => t.id === templeId);
  if (!existing) {
    return (
      <div className="py-10 text-center">
        <p className="font-display text-lg text-indigo-500">Temple not found</p>
        <Link to="/admin" className="mt-2 inline-block text-sm text-maroon-500 underline">
          Back to the temple list
        </Link>
      </div>
    );
  }

  return (
    <TempleForm
      key={existing.id}
      initialTemple={existing}
      templeId={templeId}
      onSave={(data) => actions.updateTemple(templeId, data)}
    />
  );
}
