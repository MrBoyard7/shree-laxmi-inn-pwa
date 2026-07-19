import { useData } from '../context/DataContext';
import PageHeader from '../components/layout/PageHeader';
import { LoadingSpinner } from '../components/common/Misc';
import { PhoneIcon } from '../components/common/icons';
import { telLink, isPlaceholderContact } from '../utils/links';

export default function EmergencyContacts() {
  const { emergencyContacts, isLoading } = useData();

  if (isLoading) return <LoadingSpinner label="Loading emergency contacts…" />;

  return (
    <div className="pb-28">
      <PageHeader title="Emergency Contacts" subtitle="One tap to call for help" />

      <div className="flex flex-col gap-2.5 px-5 pt-4">
        {emergencyContacts.map((contact) => {
          const isPlaceholder = isPlaceholderContact(contact.phone);
          return (
            <div
              key={contact.id}
              className="flex items-center gap-3 rounded-2xl bg-white/70 p-4 ring-1 ring-indigo-500/5"
            >
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm text-ink-700">{contact.label}</p>
                <p className="mt-0.5 text-xs text-ink-500/70">{contact.note}</p>
              </div>
              {isPlaceholder ? (
                <span className="shrink-0 rounded-xl bg-marigold-100 px-3 py-2 text-center font-utility text-xs font-semibold text-marigold-700">
                  Add number
                </span>
              ) : (
                <a
                  href={telLink(contact.phone)}
                  className="flex shrink-0 items-center gap-1.5 rounded-xl bg-maroon-500 px-3 py-2 font-utility text-sm font-semibold text-parchment-50 shadow-diya"
                >
                  <PhoneIcon /> {contact.phone}
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
