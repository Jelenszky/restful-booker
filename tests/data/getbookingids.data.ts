import { GetBookingIdsParams } from '../../src/types';

export const validFilters = {
  byFirstname: { firstname: 'John' } as GetBookingIdsParams,
  byLastname: { lastname: 'Smith' } as GetBookingIdsParams,
  byFullName: { firstname: 'John', lastname: 'Smith' } as GetBookingIdsParams,
  byCheckin: { checkin: '2024-01-01' } as GetBookingIdsParams,
  byCheckout: { checkout: '2024-12-31' } as GetBookingIdsParams,
  byDateRange: { checkin: '2024-01-01', checkout: '2024-12-31' } as GetBookingIdsParams,
  allParams: {
    firstname: 'John',
    lastname: 'Doe',
    checkin: '2024-01-01',
    checkout: '2024-12-31',
  } as GetBookingIdsParams,
};

export const invalidDateFormats = [
  {
    description: 'DD/MM/YYYY format with slashes',
    params: { checkout: '31/12/2024' } as GetBookingIdsParams,
  },
  {
    description: 'text as date value',
    params: { checkin: 'invalid-date' } as GetBookingIdsParams,
  },
  {
    description: 'impossible date values',
    params: { checkin: '2024-13-45' } as GetBookingIdsParams,
  },
  {
    description: 'XSS attempt in date',
    params: { checkin: '<script>alert(1)</script>' } as GetBookingIdsParams,
  },
];

export const edgeCases = {
  veryOldDate: { checkin: '1900-01-01' } as GetBookingIdsParams,
  farFutureDate: { checkin: '2099-12-31' } as GetBookingIdsParams,
  specialCharsInName: { firstname: "O'Brien" } as GetBookingIdsParams,
  unicodeInName: { firstname: 'José' } as GetBookingIdsParams,
};
