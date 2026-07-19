import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Footer from '../components/layout/Footer';
import NextAartiRibbon from '../components/temple/NextAartiRibbon';
import QuickActionButton from '../components/common/QuickActionButton';
import { LoadingSpinner } from '../components/common/Misc';
import { PhoneIcon, WhatsAppIcon, StarIcon, NavigateIcon } from '../components/common/icons';
import { telLink, whatsappLink, googleMapsSearchLink } from '../utils/links';

const FEATURES = [
  {
    to: '/darshan-guide',
    title: 'Ayodhya Darshan Guide',
    description: '22 temples and sacred sites, with timings and directions.',
  },
  {
    to: '/darshan-routes',
    title: 'Darshan Routes',
    description: 'Ready-made 2-hour, 4-hour and full-day circuits.',
  },
  {
    to: '/guesthouse-info',
    title: 'Guesthouse Information',
    description: 'Check-in, check-out, Wi-Fi, parking and house rules.',
  },
  {
    to: '/emergency-contacts',
    title: 'Emergency Contacts',
    description: 'Police, ambulance, hospital and the tourist helpline.',
  },
];

export default function Home() {
  const { temples, guesthouseInfo, isLoading } = useData();

  if (isLoading) {
    return <LoadingSpinner label="Welcoming you in…" />;
  }

  return (
    <div>
      <section className="bg-indigo-500 px-5 pb-8 pt-10 text-parchment-50 safe-top">
        <p className="font-utility text-xs uppercase tracking-[0.2em] text-marigold-400">
          Welcome to
        </p>
        <h1 className="mt-1 font-display text-3xl leading-tight">{guesthouseInfo.name}</h1>
        <p className="mt-1 text-sm text-parchment-100/80">{guesthouseInfo.tagline}</p>

        <div className="mt-5 grid grid-cols-4 gap-2">
          <QuickActionButton
            href={telLink(guesthouseInfo.reception.phone)}
            icon={<PhoneIcon />}
            label="Call"
            variant="gold"
          />
          <QuickActionButton
            href={whatsappLink(
              guesthouseInfo.reception.whatsapp,
              `Namaste, I am a guest at ${guesthouseInfo.name}.`,
            )}
            icon={<WhatsAppIcon />}
            label="WhatsApp"
            variant="gold"
            external
          />
          <QuickActionButton
            href={googleMapsSearchLink(guesthouseInfo.mapsQuery)}
            icon={<NavigateIcon />}
            label="Directions"
            variant="outlineLight"
            external
          />
          <QuickActionButton
            href={guesthouseInfo.googleReviewUrl}
            icon={<StarIcon />}
            label="Review"
            variant="outlineLight"
            external
          />
        </div>
      </section>

      <section className="-mt-4 px-5">
        <NextAartiRibbon temples={temples} />
      </section>

      <section className="px-5 pt-6">
        <ul className="grid grid-cols-2 gap-3">
          {FEATURES.map((feature) => (
            <li key={feature.to}>
              <Link
                to={feature.to}
                className="flex h-full flex-col justify-between rounded-2xl bg-white/70 p-4 shadow-sm ring-1 ring-indigo-500/5 transition-shadow hover:shadow-diya"
              >
                <h2 className="font-display text-base text-indigo-500">{feature.title}</h2>
                <p className="mt-1 text-xs text-ink-500/70">{feature.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <Footer />
    </div>
  );
}
