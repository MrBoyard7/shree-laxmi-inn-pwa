/**
 * Seed data for the Darshan Routes page.
 *
 * `templeIds` reference ids from temples.seed.js in visiting order. Keep
 * this in sync from the Admin Panel if temple ids ever change.
 */
export const routes = [
  {
    id: 'route-2h',
    label: '2 Hours',
    title: 'Express Darshan',
    description:
      'A quick circuit for guests with a train or bus to catch: the two most-visited temples, done right.',
    suggestedTransport: 'Walk or e-rickshaw',
    templeIds: ['01', '02'],
    isSampleData: true,
  },
  {
    id: 'route-4h',
    label: '4 Hours',
    title: 'Extended Darshan',
    description:
      'A well-paced half-day route covering the main temples plus a riverside stop at the ghats.',
    suggestedTransport: 'E-rickshaw recommended',
    templeIds: ['01', '02', '03', '04', '16'],
    isSampleData: true,
  },
  {
    id: 'route-full-day',
    label: 'Full Day',
    title: 'Complete Ayodhya Circuit',
    description:
      'The full pilgrimage circuit for guests staying a full day, covering major temples, historic sites and the Saryu ghats.',
    suggestedTransport: 'Private car or auto-rickshaw for the day',
    templeIds: ['01', '02', '03', '04', '05', '08', '15', '16', '17', '22'],
    isSampleData: true,
  },
];
