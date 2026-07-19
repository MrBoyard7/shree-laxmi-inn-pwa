import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { LoadingSpinner } from '../../components/common/Misc';

export default function RoutesEditor() {
  const { routes, temples, isLoading, actions } = useData();
  const [draftRoutes, setDraftRoutes] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [status, setStatus] = useState('');

  const workingRoutes = draftRoutes || routes;

  if (isLoading) return <LoadingSpinner label="Loading routes…" />;
  if (workingRoutes.length === 0) return <p className="text-sm text-ink-500/70">No routes yet.</p>;

  const activeRoute = workingRoutes[activeIndex];

  const updateActiveRoute = (patch) => {
    const next = workingRoutes.map((route, index) =>
      index === activeIndex ? { ...route, ...patch } : route,
    );
    setDraftRoutes(next);
  };

  const moveStop = (from, to) => {
    if (to < 0 || to >= activeRoute.templeIds.length) return;
    const ids = [...activeRoute.templeIds];
    [ids[from], ids[to]] = [ids[to], ids[from]];
    updateActiveRoute({ templeIds: ids });
  };

  const removeStop = (templeId) => {
    updateActiveRoute({ templeIds: activeRoute.templeIds.filter((id) => id !== templeId) });
  };

  const addStop = (templeId) => {
    if (!templeId || activeRoute.templeIds.includes(templeId)) return;
    updateActiveRoute({ templeIds: [...activeRoute.templeIds, templeId] });
  };

  const handleSave = async () => {
    setStatus('saving');
    await actions.saveRoutes(workingRoutes);
    setStatus('saved');
    setTimeout(() => setStatus(''), 2000);
  };

  const availableTemples = temples.filter((t) => !activeRoute.templeIds.includes(t.id));

  return (
    <div>
      <h2 className="font-display text-lg text-indigo-500">Darshan routes</h2>

      <div className="mt-3 flex gap-2">
        {workingRoutes.map((route, index) => (
          <button
            key={route.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`rounded-full px-3 py-1.5 font-utility text-xs font-semibold ${
              index === activeIndex
                ? 'bg-maroon-500 text-parchment-50'
                : 'bg-white text-indigo-500 ring-1 ring-indigo-500/10'
            }`}
          >
            {route.label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm text-ink-700">
          Title
          <input
            value={activeRoute.title}
            onChange={(e) => updateActiveRoute({ title: e.target.value })}
            className="rounded-lg border border-indigo-500/15 px-3 py-2 text-sm outline-none focus:border-maroon-500"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink-700">
          Description
          <textarea
            rows={2}
            value={activeRoute.description}
            onChange={(e) => updateActiveRoute({ description: e.target.value })}
            className="rounded-lg border border-indigo-500/15 px-3 py-2 text-sm outline-none focus:border-maroon-500"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink-700">
          Suggested transport
          <input
            value={activeRoute.suggestedTransport}
            onChange={(e) => updateActiveRoute({ suggestedTransport: e.target.value })}
            className="rounded-lg border border-indigo-500/15 px-3 py-2 text-sm outline-none focus:border-maroon-500"
          />
        </label>

        <fieldset className="rounded-lg border border-indigo-500/15 p-3">
          <legend className="px-1 text-sm font-semibold text-ink-700">Stops (in order)</legend>
          <ol className="flex flex-col gap-1.5">
            {activeRoute.templeIds.map((templeId, index) => {
              const temple = temples.find((t) => t.id === templeId);
              return (
                <li
                  key={templeId}
                  className="flex items-center gap-2 rounded-lg bg-parchment-100 px-2.5 py-1.5 text-sm"
                >
                  <span className="w-5 text-center font-semibold text-indigo-500">{index + 1}</span>
                  <span className="flex-1 truncate">{temple?.name || 'Unknown temple'}</span>
                  <button
                    type="button"
                    onClick={() => moveStop(index, index - 1)}
                    aria-label="Move up"
                    className="px-1 text-indigo-500 disabled:opacity-30"
                    disabled={index === 0}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveStop(index, index + 1)}
                    aria-label="Move down"
                    className="px-1 text-indigo-500 disabled:opacity-30"
                    disabled={index === activeRoute.templeIds.length - 1}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeStop(templeId)}
                    aria-label="Remove stop"
                    className="px-1 text-maroon-500"
                  >
                    ✕
                  </button>
                </li>
              );
            })}
          </ol>

          {availableTemples.length > 0 && (
            <select
              onChange={(e) => addStop(e.target.value)}
              value=""
              className="mt-2 w-full rounded-lg border border-indigo-500/15 px-2.5 py-1.5 text-sm"
            >
              <option value="" disabled>
                + Add a stop…
              </option>
              {availableTemples.map((temple) => (
                <option key={temple.id} value={temple.id}>
                  {temple.name}
                </option>
              ))}
            </select>
          )}
        </fieldset>

        <button
          type="button"
          onClick={handleSave}
          className="rounded-lg bg-maroon-500 py-2.5 font-utility text-sm font-semibold text-parchment-50"
        >
          {status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved ✓' : 'Save routes'}
        </button>
      </div>
    </div>
  );
}
