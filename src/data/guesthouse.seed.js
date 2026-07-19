/**
 * Seed data for guesthouse information and emergency contacts.
 *
 * Phone numbers here are placeholders except for India's official,
 * nationwide emergency numbers (112 / 100 / 101 / 108), which are safe
 * defaults. Every "[ADMIN: ...]" placeholder MUST be replaced with a
 * verified local number from the Admin Panel before the app is shared
 * with real guests — showing a wrong number for a hospital or the
 * reception desk is a genuine safety risk, not just a content gap.
 */
export const guesthouseInfo = {
  name: 'Shree Laxmi Inn',
  tagline: 'Your home for Ayodhya darshan',
  address: '[ADMIN: add the full postal address], Ayodhya, Uttar Pradesh 224123',
  checkIn: '12:00 PM',
  checkOut: '11:00 AM',
  parking: 'Secure on-site parking available for cars and two-wheelers.',
  wifi: 'Complimentary Wi-Fi in all rooms and the lobby.',
  houseRules: [
    'Check-in requires a valid government-issued photo ID for every guest.',
    'Quiet hours are from 10:00 PM to 6:00 AM.',
    'Smoking is permitted only in the designated outdoor area.',
    'Outside visitors must register at reception before entering guest floors.',
    'Please inform reception in advance for early check-in or late check-out requests.',
  ],
  reception: {
    phone: '+91XXXXXXXXXX',
    whatsapp: '91XXXXXXXXXX',
    isSampleData: true,
  },
  googleReviewUrl: 'https://g.page/r/REPLACE_WITH_GOOGLE_PLACE_ID/review',
  mapsQuery: 'Shree Laxmi Inn, Ayodhya',
};

export const emergencyContacts = [
  {
    id: 'national-emergency',
    label: 'National Emergency Number (Police / Fire / Ambulance)',
    phone: '112',
    note: 'India\u2019s unified emergency number, available 24/7 nationwide.',
    isVerifiedNational: true,
  },
  {
    id: 'police',
    label: 'Police',
    phone: '100',
    note: 'Direct police helpline.',
    isVerifiedNational: true,
  },
  {
    id: 'ambulance',
    label: 'Ambulance',
    phone: '108',
    note: 'Free emergency ambulance service.',
    isVerifiedNational: true,
  },
  {
    id: 'fire',
    label: 'Fire Brigade',
    phone: '101',
    note: 'Fire and rescue services.',
    isVerifiedNational: true,
  },
  {
    id: 'nearest-hospital',
    label: 'Nearest Hospital',
    phone: '[ADMIN: add verified hospital number]',
    note: '[ADMIN: add the hospital name and address here]',
    isVerifiedNational: false,
    isSampleData: true,
  },
  {
    id: 'tourist-helpline',
    label: 'Tourist Helpline',
    phone: '1363',
    note: 'Ministry of Tourism, Government of India, 24/7 multilingual helpline.',
    isVerifiedNational: true,
  },
];
