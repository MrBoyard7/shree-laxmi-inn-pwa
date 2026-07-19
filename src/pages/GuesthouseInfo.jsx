import PropTypes from 'prop-types';
import { useData } from '../context/DataContext';
import PageHeader from '../components/layout/PageHeader';
import { LoadingSpinner } from '../components/common/Misc';
import QuickActionButton from '../components/common/QuickActionButton';
import { PhoneIcon, WhatsAppIcon } from '../components/common/icons';
import { telLink, whatsappLink } from '../utils/links';

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2.5 text-sm">
      <span className="text-ink-500/70">{label}</span>
      <span className="font-semibold text-ink-700">{value}</span>
    </div>
  );
}

InfoRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default function GuesthouseInfo() {
  const { guesthouseInfo, isLoading } = useData();

  if (isLoading || !guesthouseInfo) return <LoadingSpinner label="Loading guesthouse info…" />;

  return (
    <div className="pb-28">
      <PageHeader title="Guesthouse Information" subtitle={guesthouseInfo.name} />

      <div className="px-5 pt-4">
        <section className="rounded-2xl bg-white/70 p-4 ring-1 ring-indigo-500/5">
          <div className="divide-y divide-indigo-500/10">
            <InfoRow label="Check-in" value={guesthouseInfo.checkIn} />
            <InfoRow label="Check-out" value={guesthouseInfo.checkOut} />
          </div>
        </section>

        <section className="mt-4 rounded-2xl bg-white/70 p-4 ring-1 ring-indigo-500/5">
          <h2 className="font-display text-base text-indigo-500">Parking &amp; Wi-Fi</h2>
          <p className="mt-2 text-sm text-ink-700">{guesthouseInfo.parking}</p>
          <p className="mt-1 text-sm text-ink-700">{guesthouseInfo.wifi}</p>
        </section>

        <section className="mt-4 rounded-2xl bg-white/70 p-4 ring-1 ring-indigo-500/5">
          <h2 className="font-display text-base text-indigo-500">House Rules</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm text-ink-700">
            {guesthouseInfo.houseRules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </section>

        <section className="mt-4 rounded-2xl bg-white/70 p-4 ring-1 ring-indigo-500/5">
          <h2 className="font-display text-base text-indigo-500">Address</h2>
          <p className="mt-2 text-sm text-ink-700">{guesthouseInfo.address}</p>
        </section>

        <div className="mt-5 flex gap-3">
          <QuickActionButton
            href={telLink(guesthouseInfo.reception.phone)}
            icon={<PhoneIcon />}
            label="Call Reception"
            variant="primary"
          />
          <QuickActionButton
            href={whatsappLink(guesthouseInfo.reception.whatsapp)}
            icon={<WhatsAppIcon />}
            label="WhatsApp Reception"
            variant="gold"
            external
          />
        </div>
      </div>
    </div>
  );
}
