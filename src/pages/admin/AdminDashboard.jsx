import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { LoadingSpinner, EmptyState } from '../../components/common/Misc';

export default function AdminDashboard() {
  const { temples, isLoading, actions } = useData();

  const handleDelete = async (templeId, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await actions.deleteTemple(templeId);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-indigo-500">Temples ({temples.length})</h2>
        <Link
          to="/admin/temples/new"
          className="rounded-lg bg-maroon-500 px-3 py-1.5 font-utility text-xs font-semibold text-parchment-50"
        >
          + Add temple
        </Link>
      </div>

      {isLoading && <LoadingSpinner label="Loading temples…" />}
      {!isLoading && temples.length === 0 && (
        <EmptyState title="No temples yet" description="Add your first temple to get started." />
      )}

      <ul className="mt-4 flex flex-col gap-2">
        {temples.map((temple) => (
          <li
            key={temple.id}
            className="flex items-center justify-between gap-3 rounded-xl bg-white p-3 ring-1 ring-indigo-500/10"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink-700">{temple.name}</p>
              <p className="text-xs text-ink-500/60">{temple.category}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Link
                to={`/admin/temples/${temple.id}`}
                className="rounded-lg bg-indigo-500/10 px-3 py-1.5 font-utility text-xs font-semibold text-indigo-500"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(temple.id, temple.name)}
                className="rounded-lg bg-maroon-500/10 px-3 py-1.5 font-utility text-xs font-semibold text-maroon-500"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
