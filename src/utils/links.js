/**
 * Deep-link builders for one-tap actions.
 *
 * Kept as small pure functions so they are trivial to unit test and to
 * reuse between the public pages and the Admin Panel preview.
 */

/** Strip everything except leading "+" and digits. */
const cleanPhone = (phone = '') => phone.replace(/(?!^\+)[^\d]/g, '');

export const telLink = (phone) => `tel:${cleanPhone(phone)}`;

export const whatsappLink = (phone, message = '') => {
  const digitsOnly = cleanPhone(phone).replace('+', '');
  const query = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${digitsOnly}${query}`;
};

/**
 * Build a Google Maps "directions" or "search" URL.
 * Prefers a free-text query (temple/place name) over raw coordinates,
 * since Google's own index resolves a well-formed name more reliably
 * than a hand-entered lat/lng pair.
 */
export const googleMapsSearchLink = (query) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

export const googleMapsDirectionsLink = (destinationQuery) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destinationQuery)}`;

export const isPlaceholderContact = (value = '') => /^\[ADMIN:/.test(value.trim());
