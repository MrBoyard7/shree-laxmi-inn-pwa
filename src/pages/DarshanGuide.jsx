import { useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import PageHeader from '../components/layout/PageHeader';
import TempleCard from '../components/temple/TempleCard';
import { EmptyState, LoadingSpinner } from '../components/common/Misc';
import { TEMPLE_CATEGORIES } from '../data/temples.seed';

export default function DarshanGuide() {
  const { temples, isLoading } = useData();
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = useMemo(() => ['All', ...TEMPLE_CATEGORIES], []);

  const filteredTemples = useMemo(() => {
    if (activeCategory === 'All') return temples;
    return temples.filter((t) => t.category === activeCategory);
  }, [temples, activeCategory]);

  return (
    <div>
      <PageHeader
        title="Ayodhya Darshan Guide"
        subtitle={`${temples.length} temples & sacred sites`}
      />

      <div className="scrollbar-hide flex gap-2 overflow-x-auto px-5 py-4">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 font-utility text-xs font-semibold transition-colors ${
              activeCategory === category
                ? 'bg-maroon-500 text-parchment-50'
                : 'bg-white text-indigo-500 ring-1 ring-indigo-500/10'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2.5 px-5 pb-28">
        {isLoading && <LoadingSpinner label="Loading temples…" />}
        {!isLoading && filteredTemples.length === 0 && (
          <EmptyState
            title="No sites in this category yet"
            description="Add temples for this category from the Admin Panel."
          />
        )}
        {filteredTemples.map((temple) => (
          <TempleCard key={temple.id} temple={temple} />
        ))}
      </div>
    </div>
  );
}
