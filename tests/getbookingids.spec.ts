import { test, expect } from '../common/fixtures';
import { ErrorMessages, HttpStatus } from '../common/constants';
import { GetBookingIdsResponseSchema, BookingIdSchema } from '../src/types';
import { validFilters, invalidDateFormats, edgeCases } from './data/getbookingids.data';

test.describe('GetBookingIds - schema validation', () => {
  test('should return valid schema for all booking IDs', async ({ serviceFactory }) => {
    const bookingService = serviceFactory.createGetBookingIdsService();
    const bookings = await bookingService.getBookingIds();

    const result = GetBookingIdsResponseSchema.safeParse(bookings);
    expect(result.success).toBeTruthy();
  });

  test('should return array with valid bookingid numbers', async ({ serviceFactory }) => {
    const bookingService = serviceFactory.createGetBookingIdsService();
    const bookings = await bookingService.getBookingIds();

    expect(Array.isArray(bookings)).toBeTruthy();

    bookings.forEach((booking, index) => {
      const result = BookingIdSchema.safeParse(booking);
      expect(result.success, `Booking at index ${index} failed schema validation`).toBeTruthy();
      expect(booking.bookingid).toBeGreaterThan(0);
      expect(Number.isInteger(booking.bookingid)).toBeTruthy();
    });
  });
});

test.describe('GetBookingIds - filtering by name', () => {
  test('should filter bookings by firstname', async ({ serviceFactory }) => {
    const bookingService = serviceFactory.createGetBookingIdsService();
    const bookings = await bookingService.getBookingIds(validFilters.byFirstname);

    const result = GetBookingIdsResponseSchema.safeParse(bookings);
    expect(result.success).toBeTruthy();
  });

  test('should filter bookings by lastname', async ({ serviceFactory }) => {
    const bookingService = serviceFactory.createGetBookingIdsService();
    const bookings = await bookingService.getBookingIds(validFilters.byLastname);

    const result = GetBookingIdsResponseSchema.safeParse(bookings);
    expect(result.success).toBeTruthy();
  });

  test('should filter bookings by firstname and lastname', async ({ serviceFactory }) => {
    const bookingService = serviceFactory.createGetBookingIdsService();
    const bookings = await bookingService.getBookingIds(validFilters.byFullName);

    const result = GetBookingIdsResponseSchema.safeParse(bookings);
    expect(result.success).toBeTruthy();
  });
});

test.describe('GetBookingIds - filtering by date', () => {
  test('should filter bookings by checkin date', async ({ serviceFactory }) => {
    const bookingService = serviceFactory.createGetBookingIdsService();
    const bookings = await bookingService.getBookingIds(validFilters.byCheckin);

    const result = GetBookingIdsResponseSchema.safeParse(bookings);
    expect(result.success).toBeTruthy();
  });

  test('should filter bookings by checkout date', async ({ serviceFactory }) => {
    const bookingService = serviceFactory.createGetBookingIdsService();
    const bookings = await bookingService.getBookingIds(validFilters.byCheckout);

    const result = GetBookingIdsResponseSchema.safeParse(bookings);
    expect(result.success).toBeTruthy();
  });

  test('should filter bookings by date range', async ({ serviceFactory }) => {
    const bookingService = serviceFactory.createGetBookingIdsService();
    const bookings = await bookingService.getBookingIds(validFilters.byDateRange);

    const result = GetBookingIdsResponseSchema.safeParse(bookings);
    expect(result.success).toBeTruthy();
  });
});

test.describe('GetBookingIds - combined filters', () => {
  test('should filter with all parameters', async ({ serviceFactory }) => {
    const bookingService = serviceFactory.createGetBookingIdsService();
    const bookings = await bookingService.getBookingIds(validFilters.allParams);

    const result = GetBookingIdsResponseSchema.safeParse(bookings);
    expect(result.success).toBeTruthy();
  });
});

test.describe('GetBookingIds - negative scenarios (invalid date formats)', () => {
  for (const { description, params } of invalidDateFormats) {
    test(`should return empty array for ${description}`, async ({ serviceFactory }) => {
      const bookingService = serviceFactory.createGetBookingIdsService();
      const respone = await bookingService.getBookingIdsResponse(params);

      expect(respone.status()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(await respone.text()).toContain(ErrorMessages.BOOKING.INTERNAL_SERVER_ERROR);
    });
  }
});

test.describe('GetBookingIds - edge cases', () => {
  test('should handle very old date', async ({ serviceFactory }) => {
    const bookingService = serviceFactory.createGetBookingIdsService();
    const bookings = await bookingService.getBookingIds(edgeCases.veryOldDate);

    const result = GetBookingIdsResponseSchema.safeParse(bookings);
    expect(result.success).toBeTruthy();
  });

  test('should handle future date far in advance', async ({ serviceFactory }) => {
    const bookingService = serviceFactory.createGetBookingIdsService();
    const bookings = await bookingService.getBookingIds(edgeCases.farFutureDate);

    const result = GetBookingIdsResponseSchema.safeParse(bookings);
    expect(result.success).toBeTruthy();
  });

  test('should handle special characters in name filter', async ({ serviceFactory }) => {
    const bookingService = serviceFactory.createGetBookingIdsService();
    const bookings = await bookingService.getBookingIds(edgeCases.specialCharsInName);

    const result = GetBookingIdsResponseSchema.safeParse(bookings);
    expect(result.success).toBeTruthy();
  });

  test('should handle unicode characters in name filter', async ({ serviceFactory }) => {
    const bookingService = serviceFactory.createGetBookingIdsService();
    const bookings = await bookingService.getBookingIds(edgeCases.unicodeInName);

    const result = GetBookingIdsResponseSchema.safeParse(bookings);
    expect(result.success).toBeTruthy();
  });
});
