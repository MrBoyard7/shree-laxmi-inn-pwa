import { describe, it, expect } from 'vitest';
import {
  telLink,
  whatsappLink,
  googleMapsSearchLink,
  googleMapsDirectionsLink,
  isPlaceholderContact,
} from '../links';

describe('telLink', () => {
  it('strips formatting characters but keeps a leading +', () => {
    expect(telLink('+91 (12345) 67890')).toBe('tel:+911234567890');
  });
});

describe('whatsappLink', () => {
  it('builds a wa.me link without a message when none is given', () => {
    expect(whatsappLink('+91 98765 43210')).toBe('https://wa.me/919876543210');
  });

  it('includes an encoded prefilled message when provided', () => {
    const link = whatsappLink('+919876543210', 'Namaste!');
    expect(link).toBe('https://wa.me/919876543210?text=Namaste!');
  });
});

describe('googleMapsSearchLink / googleMapsDirectionsLink', () => {
  it('URL-encodes the place query', () => {
    expect(googleMapsSearchLink('Hanuman Garhi, Ayodhya')).toBe(
      'https://www.google.com/maps/search/?api=1&query=Hanuman%20Garhi%2C%20Ayodhya',
    );
  });

  it('builds a directions link to the destination query', () => {
    expect(googleMapsDirectionsLink('Kanak Bhawan, Ayodhya')).toBe(
      'https://www.google.com/maps/dir/?api=1&destination=Kanak%20Bhawan%2C%20Ayodhya',
    );
  });
});

describe('isPlaceholderContact', () => {
  it('flags admin placeholders', () => {
    expect(isPlaceholderContact('[ADMIN: add verified number]')).toBe(true);
  });

  it('does not flag a real phone number', () => {
    expect(isPlaceholderContact('+911234567890')).toBe(false);
  });
});
